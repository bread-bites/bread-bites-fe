import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { AppBar, Box, Button, Toolbar } from '@mui/material'
import HeaderMenu from './HeaderMenu'

export default function Header() {
  return (
    <Box className='grow'>
      <AppBar position="static">
        <Toolbar className='flex gap-4'>
          <Box className='grow'>&nbsp;</Box>
          <SignedOut>
            <Box>
              <SignInButton>
                <Button color='success' variant='contained'>Lemme In!</Button>
              </SignInButton>
            </Box>
          </SignedOut>
          <SignedIn>
            <Box>
              <HeaderMenu/>
            </Box>
          </SignedIn>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
