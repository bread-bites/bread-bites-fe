import { SignOutButton } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { m } from '@paraglide/messages';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { Button } from './ui/button';
import { FilePlusIcon, ImagePlusIcon, LogOutIcon, MenuIcon } from 'lucide-react';
import { Separator } from './ui/separator';

export default function HeaderMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger render={<Button variant='outline' />}>
            <MenuIcon size={28}/>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='gap-2'>
              <li>
                <NavigationMenuLink render={<Link to='/image/insert' className='flex gap-2' />}>
                  <ImagePlusIcon size={28}/>
                  <p>{m.main_add_image()}</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<Link to='/text/insert' className='flex gap-2' />}>
                  <FilePlusIcon size={28}/>
                  <p>{m.main_add_text()}</p>
                </NavigationMenuLink>
              </li>
              <li>
                <SignOutButton>
                  <>
                    <Separator />
                    <NavigationMenuLink render={<div className='flex gap-2' />}>
                      <LogOutIcon size={28}/>
                      <p>{m.main_logout()}</p>
                    </NavigationMenuLink>
                  </>
                </SignOutButton>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
