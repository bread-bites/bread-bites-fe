import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '@/components/Header'
import ClerkProvider from '@/integrations/clerk/provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import appCss from '@/styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme'
import { Box, CssBaseline, GlobalStyles } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { ModalHookProvider } from '@/hooks/modal-hook-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
});

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' })
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ClerkProvider>
          <ModalHookProvider>
            <>
              <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
              {children}
              <TanStackDevtools
                config={{ position: 'bottom-right' }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </>
          </ModalHookProvider>
        </ClerkProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
