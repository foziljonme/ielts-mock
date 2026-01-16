// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXT_PUBLIC_API_URL: string
    JWT_SECRET: string
  }
}
