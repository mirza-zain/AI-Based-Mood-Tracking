## AI Based Mood Tracking Journal

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm or pnpm
- PostgreSQL Database (e.g., Neon PostgreSQL)
- Groq API Key (for AI analysis)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
   GROQ_API_KEY="gsk_..."
   ```

### Scripts

- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Format: `npm run format`

### Notable Routes

- `/` Landing page & Authentication (Sign up / Log in)
- `/journal` User's journal entries list & entry creation
- `/journal/[id]` Journal entry editor with live AI mood analysis
- `/history` Visual mood history charts & sentiment trends
- `/api/health` Live database and connection health check
