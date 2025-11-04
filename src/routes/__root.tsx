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

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from '@/theme'
import { Box } from '@mui/material'

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
      {
        rel: 'stylesheet',
        href: appCss,
      }
    ],
  }),
  shellComponent: RootDocument,
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <ClerkProvider>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ClerkProvider>
      </ThemeProvider>
    </StyledEngineProvider>
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
          <Header />
          <Box className='p-4 min-h-full'>
            {children}
          </Box>
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
