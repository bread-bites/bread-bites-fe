import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import HeaderMenu from './HeaderMenu'
import { Link } from '@tanstack/react-router'
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { m } from '@paraglide/messages';

export default function Header() {
  return (
    <Box className='grow'>
      <AppBar position="static">
        <Toolbar className='flex gap-4'>
          <Box className='grow'>
            <Link to='/'>
              <Typography variant='h5' className='font-bold!'>
                Bread Bites
              </Typography>
            </Link>
          </Box>
          <Box className='flex gap-4'>
            <Tooltip title="Image (Reaction)">
              <Link to='/image'>
                <IconButton>
                  <ImageIcon/>
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Copypasta">
              <Link to='/text'>
                <IconButton>
                  <ArticleIcon/>
                </IconButton>
              </Link>
            </Tooltip>
            <SignedOut>
              <SignInButton>
                <Button color='success' size='small' variant='contained'>{m.main_login()}</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <HeaderMenu />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
