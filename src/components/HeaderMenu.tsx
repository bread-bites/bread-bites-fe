import { Box, Divider, IconButton, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react';
import { SignOutButton } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { m } from '@paraglide/messages';

export default function HeaderMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleClick}>
        <MenuIcon/>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <Link to='/image/insert' className='flex gap-5'>
            <AddAPhotoIcon />
            {m.main_add_image()}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to='/text/insert' className='flex gap-5'>
            <NoteAddIcon />
            {m.main_add_text()}
          </Link>
        </MenuItem>
        <Divider/>
        <MenuItem>
          <SignOutButton>
            <Box className='flex gap-5'>
              <LogoutIcon />
              {m.main_logout()}
            </Box>
          </SignOutButton>
        </MenuItem>
      </Menu>
    </>
  )
}
