import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { Button } from './ui/button';
import { CheckIcon, LanguagesIcon } from 'lucide-react';
import { getLocale, locales, setLocale } from '@paraglide/runtime';

export default function HeaderLanguage() {
  const mapper = {
    'en': 'English',
    'zh': '中文',
    'id': 'Bahasa Indonesia',
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger render={<Button variant='outline' />}>
            <LanguagesIcon size={28}/>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='gap-2'>
              {
                locales.map(locale => (
                  <NavigationMenuLink active={locale === getLocale()} key={locale} render={<li onClick={() => setLocale(locale)} className='flex gap-4 justify-between' />}>
                    <p>{mapper[locale]}</p>
                    {locale === getLocale() && <CheckIcon/>}
                  </NavigationMenuLink>
                ))
              }
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
