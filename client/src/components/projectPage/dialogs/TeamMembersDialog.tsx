import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Autocomplete, TextField, Box, Stack, CircularProgress } from '@mui/material'
import { TUser } from '../../../model/TUser'
import { ProjectContext } from '../../../routes/ProjectPage'
import { addUserToProject } from '../../../api/addUserToProject'
import TeamMember from '../TeamMember'
import { removeUserFromProject } from '../../../api/removeUserFromProject'
import { useAuth } from '../../../customHooks/useAuth'
import { searchUsers } from '../../../api/searchUsers'
import { getProject } from '../../../api/getProject'
import { fetchUsers } from '../Fields/MembersField'
import LoadingDialog from './LoadingDialog'

interface TextBlockDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
  initialMembers: TUser[]
  setMembers: React.Dispatch<SetStateAction<TUser[]>>
}

interface AutocompleteOption {
  label: string;
  user: TUser;
}

export default function TeamMembersDialog({ isDialogOpen, setIsDialogOpen, initialMembers, setMembers }: TextBlockDialogProps) {

  const { project, setProject, setProjectChanges } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  // Edit members states
  const [currMembers, setCurrMembers] = useState<TUser[]>([]);
  const [newMembers, setNewMembers] = useState<TUser[]>([]);
  const [membersToDelete, setMembersToDelete] = useState<TUser[]>([]);

  // Combo box states
  const [options, setOptions] = useState<AutocompleteOption[]>([])
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isResultsLoading, setIsResultsLoading] = useState(false);

  // Resets all member states everytime dialog opens
  useEffect(() => {
    setCurrMembers(initialMembers);
    setNewMembers([]);
    setMembersToDelete([]);
    setSelectedOption(null);
    setOptions([])
    setInputValue('')
  }, [isDialogOpen])

  // Adds selected user to current members list
  useEffect(() => {
    if (selectedOption) {

      let members = [...currMembers]
      members.push(selectedOption.user)
      setCurrMembers(members);

      members = [...newMembers];
      members.push(selectedOption.user);
      setNewMembers(members);

      setSelectedOption(null);
      setInputValue('')
    }
  }, [selectedOption])

  // Fetches users based on keyword
  // ...doesn't do search if keyword is empty string
  useEffect(() => {
    if (inputValue !== '') {
      setIsResultsLoading(true)
      searchUsers(inputValue, true, 0, 5, 'graduate')
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((results) => {
              setOptions(results.map((result: TUser) => (
                { label: result.name, user: result })
              ))
            })
          }
        }).finally(() => {
          setIsResultsLoading(false);
          if (!inputValue) {
            setOptions([]);
          }
        })
    } else {
      setOptions([]);
    }

  }, [inputValue])


  const handleClose = () => {
    setIsDialogOpen(false);
  }

  const handleSave = () => {
    setIsLoading(true);

    const addDeleteUsers = async () => {
      let latestProject: any = project
      for (let i = 0; i < newMembers.length; i++) {
        const resp = await addUserToProject(
          project._id,
          newMembers[i]._id,
          auth.getToken() as string
        );
        if (resp.ok) {
          latestProject = await resp.json();
        } else {
          console.log(await resp.text());
        }
      }

      for (let i = 0; i < membersToDelete.length; i++) {
        const resp = await removeUserFromProject(
          project._id,
          membersToDelete[i]._id,
          auth.getToken() as string
        );
        if (resp.ok) {
          latestProject = await resp.json();
        } else {
          console.log(await resp.text());
        }
      }

      fetchUsers(latestProject.members)
        .then(users => setMembers(users));
      // setProject(latestProject);
      setIsLoading(false);
      setIsDialogOpen(false);
    }

    addDeleteUsers();
  }

  const handleUserRemove = (user: TUser, index: number) => {
    let members = [...currMembers]
    members.splice(index, 1);
    setCurrMembers(members);

    const newMemberIndex = newMembers.indexOf(user);
    // If user is queued to be added then remove from queue
    // ... otherwise add to delete queue.
    if (newMemberIndex !== -1) {
      members = [...newMembers];
      members.splice(newMemberIndex, 1);
      setNewMembers(members)
    } else {
      members = [...membersToDelete];
      members.push(user)
      setMembersToDelete(members);
    }
  }

  return (
    isLoading ? 
      <LoadingDialog isOpen={isLoading}/>
      :
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            p: 2
          }
        }}
      >
        <DialogTitle>Edit Team Members</DialogTitle>
          <>
            <DialogContent>
              <Stack
                width={'400px'}
                minHeight={'500px'}
              >
                <Box
                  flex={1}
                  mb={2}
                  maxHeight={'70vh'}
                  overflow={'auto'}
                >
                  {currMembers.map((m, i) => (
                    <TeamMember
                      key={i}
                      name={m.name}
                      avatar={m.profilePicture}
                      userId={m._id}
                      isDeletable={currMembers.length > 1} // Projects must have atleast 1 member
                      onDelete={() => handleUserRemove(m, i)}
                    />
                  ))}
                </Box>

                <Autocomplete
                  popupIcon={null}
                  disablePortal
                  blurOnSelect
                  autoComplete
                  noOptionsText={'No results'}
                  // Don't show results already added
                  filterOptions={x => x.filter(
                    o => !currMembers.some(e => e._id === o.user._id)
                  )}
                  loading={isResultsLoading}
                  // For controlled component
                  inputValue={inputValue}
                  onInputChange={(evt, value) => setInputValue(value)}
                  value={selectedOption}
                  onChange={(evt, option) => setSelectedOption(option)}
                  // No dropdown if theres no value entered.
                  componentsProps={{
                    paper: {
                      sx: {
                        display: inputValue === '' ? 'none' : 'block'
                      }
                    }
                  }}
                  isOptionEqualToValue={(option, value) => option.user._id === value.user._id}
                  options={options}
                  sx={{ width: '100%' }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.user._id}>
                        <TeamMember
                          name={option.user.name}
                          avatar={option.user.profilePicture}
                          userId={option.user._id}
                          isLink={false}
                        />
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params}
                      fullWidth
                      hiddenLabel
                      placeholder='Add users...'
                      size='small'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isResultsLoading ? <CircularProgress color="primary" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />

              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </>
      </Dialog >
  )
}
