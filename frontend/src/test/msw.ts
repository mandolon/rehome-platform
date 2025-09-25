import { setupServer } from 'msw/node'
// Import your handlers if you have them; otherwise keep empty for now.
// e.g., import { handlers } from '@/mocks/handlers'
export const server = setupServer(/* ...handlers */)
