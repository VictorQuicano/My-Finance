import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    // Falls back gracefully if not set at config-load time.
    // Ensure DATABASE_URL is in your environment before running migrate/studio.
    url: process.env.DATABASE_URL,
  },
})
