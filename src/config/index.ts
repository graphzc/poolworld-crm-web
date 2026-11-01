import { z } from 'zod'
import { createEnv } from '@/utils/env/createEnv'

const env = createEnv({
  VITE_API_URL: z.url(),
})

export const config = {
  apiUrl: env.VITE_API_URL,
}
