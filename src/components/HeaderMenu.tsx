import { Box, ButtonBase, Divider, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react';
import { SignOutButton } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';

export default function HeaderMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <ButtonBase onClick={handleClick}>
        <MenuIcon/>
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <Link to='/image/insert' className='flex gap-5'>
            <AddAPhotoIcon />
            Add New Image
          </Link>
        </MenuItem>
        <Divider/>
        <MenuItem>
          <SignOutButton>
            <Box className='flex gap-5'>
              <LogoutIcon />
              Bye
            </Box>
          </SignOutButton>
        </MenuItem>
      </Menu>
    </Box>
  )
}
