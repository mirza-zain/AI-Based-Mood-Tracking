import { render } from '@testing-library/react'
import { vi } from 'vitest'
import HomePage from '../src/app/page'

// Mock the Clerk server module
vi.mock('@clerk/nextjs/server', () => {
    return {
        auth: async () => ({
            userId: 'user_iaosrjpojasdj',
            sessionId: 'test_session'
        }),
    }
})

// Mock the regular Clerk client module
vi.mock('@clerk/nextjs', () => {
    return {
        ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
        useUser: () => ({
            isSignedIn: true,
            user: {
                id: 'user_2NNEqL2nrIRdJ194ndJqAHwEfxC',
                fullName: 'Charles Harris',
            },
        }),
    }
})

test(`Home`, async () => {
  const { getByText } = render(await HomePage())
  expect(getByText('Get Started')).toBeTruthy()
})