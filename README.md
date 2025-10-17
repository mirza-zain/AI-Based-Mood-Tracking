## AI Based Mood Tracking Journal

### Prerequisites

- Node.js 18+ (recommended 20+)
- pnpm or npm
- Clerk account for auth (or disable middleware if not using yet)

### Setup

1. Install dependencies
	- npm: `npm install`
	- pnpm: `pnpm install`

2. Configure environment variables in `.env.local`:

	Required for Clerk:
	- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
	- CLERK_SECRET_KEY=

	Optional (when using auth redirects):
	- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
	- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

### Scripts

- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Format: `npm run format`

### Notable Routes

- `/` Landing page
- `/new-user` Placeholder page
- `/sign-in` Clerk sign-in
- `/sign-up` Clerk sign-up
- `/api/health` API health check

### Notes

- Middleware is configured to require auth for all routes except `/`, `/sign-in`, and `/sign-up`. Adjust `src/middleware.ts` as needed.