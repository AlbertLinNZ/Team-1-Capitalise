import React, { useState } from 'react'

import { Button, Chip, Avatar, useTheme, Box, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'


interface FieldProps {
  name: string
  avatar: string
  role?: string
  userId: string
}

export default function TeamMember({ name, avatar, userId }: FieldProps) {

  const [fieldState, setFieldState] = useState('')
  const theme = useTheme()

  const Member = styled(Button)({
    borderRadius: '5px',
    textTransform: 'capitalize',
    fontWeight: 300,
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "40px",
    color: 'black'
  })

  return (
    <Box width='100%' display='flex' flexDirection={'row'} >
      {/* Needs to redirect to user page onclick */}
      <Link to={`../user/${userId}`} style={{width: '100%'}}>
        <Member
          startIcon={
            <Avatar
              imgProps={{ referrerPolicy: "no-referrer" }}
              sizes='small'
              alt={name}
              src={avatar}
              sx={{ width: 30, height: 30 }}
            />
          }
          variant='text'
          color='neutral' // Ignore type error.
          size='large'
          fullWidth
          style={{}}
        >
          {name}
        </Member>
      </Link>
    </Box>
  )
}