import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import appCss from '@/styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { ModalHookProvider } from '@/hooks/modal-hook-provider'
import { getLocale } from '@paraglide/runtime'
import AppClerkProvider from '@/integrations/clerk/provider'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { TooltipProvider } from '@/components/ui/tooltip'

interface MyRouterContext {
  queryClient: QueryClient
}

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  return {
    userId,
  }
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth();
    return { userID: userId };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AppClerkProvider>
        <ModalHookProvider>
          <>
            {children}
          </>
        </ModalHookProvider>
      </AppClerkProvider>
    </TooltipProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} className='dark'>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
