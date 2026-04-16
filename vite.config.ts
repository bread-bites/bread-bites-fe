import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [,
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./app/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ["en", "/en/:path(.*)?"],
            ["id", "/id/:path(.*)?"],
            ["zh", "/zh/:path(.*)?"],
          ],
        },
      ],
    }),
  ],
  optimizeDeps: {
    include: ['cookie']
  },
  // ssr: {
  //   noExternal: ['@mui/*'],
  // },
})

export default config
