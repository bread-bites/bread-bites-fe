import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import HeaderMenu from './HeaderMenu'
import { Link } from '@tanstack/react-router'
import { m } from '@paraglide/messages';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { FileTextIcon, ImageIcon } from 'lucide-react';
import HeaderLanguage from './HeaderLanguage';

export default function Header() {
  return (
    <div className='grow w-full bg-sidebar-primary'>
      <div className='flex justify-between px-4 py-2'>
        {/* Title */}
        <div className='flex items-center'>
          <Link to='/'>
            <p className='text-xl font-bold'>Bread Bites</p>
          </Link>
        </div>

        {/* Menu */}
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger render={<div></div>}>
              <Link to='/image'>
                <Button variant='outline'>
                  <ImageIcon size={28}/> 
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Image (Reaction)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<div></div>}>
              <Link to='/text'>
                <Button variant='outline'>
                  <FileTextIcon size={28}/>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Copypasta</TooltipContent>
          </Tooltip>

          <HeaderLanguage/>

          <SignedOut>
            <SignInButton>
              <Button variant='success'>{m.main_login()}</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <HeaderMenu />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}
