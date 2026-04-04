declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VITE_CLERK_PUBLISHABLE_KEY: string,
      readonly CLERK_SECRET_KEY: string,
      readonly API_URL: string,
    }
  }
}

export {}