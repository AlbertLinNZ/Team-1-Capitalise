import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { useAuth } from "../../../customHooks/useAuth";
import { ProjectContext } from "../../../routes/ProjectPage";
import { TTag } from "../../../model/TTag";
import { addTagToProject, createNewTag, removeTagFromProject, searchTags } from "../../../api/tagAPIs";
import { Autocomplete, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, useTheme } from "@mui/material";
import { patchProject } from "../../../api/patchProject";
import { getProject } from "../../../api/getProject";
import LoadingDialog from "./LoadingDialog";

interface EditTagsDialog {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export interface AutocompleteOption {
  label: string;
  tag: TTag;
  isNew?: boolean;
}

export default function EditTagsDialog({ isDialogOpen, setIsDialogOpen }: EditTagsDialog) {
  const { project, setProject, setProjectChanges } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const theme = useTheme();

  // Edit tags states
  const [currTags, setCurrTags] = useState<TTag[]>([]);
  const [tagsToAdd, setTagsToAdd] = useState<TTag[]>([]);
  const [tagsToRemove, setTagsToRemove] = useState<TTag[]>([]);
  const [tagsToCreate, setTagsToCreate] = useState<TTag[]>([]);

  // Combo box states
  const [options, setOptions] = useState<AutocompleteOption[]>([])
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');


  // Resets all member states everytime dialog opens
  useEffect(() => {
    setCurrTags([...project.tags]);
    setTagsToCreate([]);
    setTagsToAdd([]);
    setTagsToRemove([]);
    setSelectedOption(null);
    setOptions([])
    setInputValue('')
  }, [isDialogOpen])

  // Adds selected tag to current tags list
  useEffect(() => {
  }, [selectedOption])

  // Fetches tags based on keyword
  // ...doesn't do search if keyword is empty string
  useEffect(() => {
    if (inputValue !== '' && !selectedOption) {
      setIsResultsLoading(true)
      searchTags(inputValue, 0)
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((results: TTag[]) => {
              results.splice(5) // Only care about 5 results
              setOptions(results.map((result: TTag) => (
                { label: result.name, tag: result }) // Create select option for each tag
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

    // Can't decide if I should patch the project directly or use dedicated lambda endpoints.
    //...the lambda endpoints are alot slower.
    const patchTags = async () => {
      let latestProject = project
      const tagsToPatch: TTag[] = JSON.parse(JSON.stringify(project.tags))

      // Remove tags
      tagsToRemove.forEach((tag) => {
        const i = tagsToPatch.findIndex((t) => t._id === tag._id)
        tagsToPatch.splice(i, 1);
        // promises.push(removeTagFromProject(
        //   project._id, 
        //   tag.name, 
        //   auth.getToken() as string
        // ))
      })

      // Add tags
      tagsToAdd.forEach((tag) => {
        tagsToPatch.push(tag);

        // promises.push(addTagToProject(
        //   project._id, 
        //   tag.name, 
        //   auth.getToken() as string
        // ))
      })

      tagsToCreate.forEach(tag => {
        tagsToPatch.push(tag)
      })

      // Patch changes
      if (tagsToPatch.length > 0) {
        const resp = await patchProject(
          project._id,
          { "tags": tagsToPatch.map(tag => tag.name) },
          auth.getToken() as string
        )
        if (resp.ok) {
          latestProject = await resp.json()
        } else {
          console.log(await resp.text())
        }
      }

      // // Now create new tags.
      // for (let i = 0; i < tagsToCreate.length; i++) {
      //   console.log('running')
      //   const resp = await createNewTag(
      //     project._id,
      //     tagsToCreate[i].name,
      //     auth.getToken() as string
      //   );
      //   if (resp.ok) {
      //     latestProject = await resp.json();
      //   } else {
      //     console.log(await resp.text());
      //   }
      // }

      setProject(latestProject)
      setIsDialogOpen(false);
      setIsLoading(false);

      // setProjectChanges()

      // patchProject()

      // tagsToCreate.forEach(t => {
      //   promises.push(createNewTag(
      //     project._id,
      //     t.name,
      //     auth.getToken() as string
      //   ))
      // })

      // // After all changes are made fetch the latest project.
      // Promise.all(promises)
      //   .then(() => getProject(project._id))
      //   .then((proj) => {
      //     if (proj) {
      //       setProject(proj);
      //     }
      //   }).finally(() => {
      //     setIsLoading(false);
      //     setIsDialogOpen(false);
      //   })
    }

    patchTags();
  }

  const handleTagRemove = (tag: TTag) => {
    setCurrTags(currTags.filter(t => t._id !== tag._id));

    const currTagIndex = tagsToAdd.indexOf(tag);
    // If tag is queued to be added then remove from queue
    // ... otherwise add to delete queue.
    if (currTagIndex !== -1) {
      tagsToAdd.splice(currTagIndex, 1);
      setTagsToAdd(tagsToAdd);
    } else {
      tagsToRemove.push(tag)
      setTagsToRemove(tagsToRemove)
    }
  }

  const handleTagSelected = (selectedOption: AutocompleteOption | null) => {
    if (selectedOption && !currTags.includes(selectedOption.tag)) {
      // Set the currently displayed tags
      currTags.push(selectedOption.tag)
      setCurrTags(currTags);

      const tag = selectedOption.tag;
      // if name is same has Id then its a new tag 
      if (selectedOption.isNew) {
        tagsToCreate.push(tag)
        setTagsToCreate(tagsToCreate);
      } else {
        tagsToAdd.push(tag);
        setTagsToAdd(tagsToAdd);
      }
      // setSelectedOption(null);
      setInputValue('')
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          p: 2
        }
      }}
    >

      <DialogTitle>Edit Tags</DialogTitle>

      {isLoading ?
        <LoadingDialog isOpen={isLoading} />
        :
        <>
          <DialogContent>
            <Stack
              width={'400px'}
              minHeight={'300px'}
            >
              <Box
                flex={1}
                mb={2}
                maxHeight={'70vh'}
                overflow={'auto'}
              >
                {currTags.map((tag) => (
                  <Chip
                    key={tag._id}
                    size='medium'
                    label={tag.name}
                    onDelete={() => handleTagRemove(tag)}
                    sx={{
                      m: 0.5
                    }}
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
                filterOptions={(x, params) => {
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue.trim().toLowerCase() === option.tag.name.toLowerCase());
                  if (inputValue !== '' && !isExisting) {
                    x.push({
                      label: `Add new tag "${inputValue.trim()}"`,
                      tag: { _id: inputValue.trim(), name: inputValue.trim() },
                      isNew: true
                    });
                  }
                  const filtered: AutocompleteOption[] = x.filter(o => !currTags.some(e => e._id === o.tag._id));
                  return filtered;
                }}
                loading={isResultsLoading}
                // For controlled component
                inputValue={inputValue}
                onInputChange={(evt, value) => setInputValue(value)}
                value={selectedOption}
                onChange={(evt, option) => handleTagSelected(option)}
                // No dropdown if theres no value entered.
                componentsProps={{
                  paper: {
                    sx: {
                      display: inputValue === '' ? 'none' : 'block'
                    }
                  }
                }}
                isOptionEqualToValue={(option, value) => option.tag._id === value.tag._id}
                options={options}
                sx={{ width: '100%' }}
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      key={option.tag._id}
                      // Display add option in different colour
                      style={{
                        fontWeight: option.tag._id === option.tag.name ? 450 : 400
                      }}
                    >
                      {option.label}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params}
                    fullWidth
                    hiddenLabel
                    placeholder='Add tags...'
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

      }
    </Dialog >

  )
}
