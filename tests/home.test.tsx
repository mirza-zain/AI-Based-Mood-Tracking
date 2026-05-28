import { render } from '@testing-library/react'
import { vi, test, expect } from 'vitest'
import HomePage from '../src/app/page'

// Mock useRouter from next/navigation
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      refresh: vi.fn(),
    }),
  }
})

test(`Home`, () => {
  const { getByText } = render(<HomePage />)
  expect(getByText('Get Started')).toBeTruthy()
})