import { TestSection } from '../../prisma/generated/enums'

export const BASE_URL = 'http://localhost:3001/api'
export const TOKEN_KEY = 'access_token'
export const TOKEN_EXPIRES_IN = 60 * 30 // 30 minutes
export const CANDIDATE_TOKEN_EXPIRES_IN = 60 * 60 * 6 // 6 hours
// export const TOKEN_EXPIRES_IN = 60 * 0.05 // 30 minutes
export const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7 // 7 days

export const SECTIONS: { name: TestSection; label: string }[] = [
  { name: TestSection.LISTENING, label: 'Listening' },
  { name: TestSection.READING, label: 'Reading' },
  { name: TestSection.WRITING, label: 'Writing' },
]
