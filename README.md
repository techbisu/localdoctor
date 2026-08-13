# HealthFind

A modern healthcare discovery platform built with Next.js, Prisma, and PostgreSQL. HealthFind helps citizens find and book appointments with doctors, pharmacies, and diagnostic labs in their locality.

## Features

- **Doctor Discovery** — Search doctors by specialization, location, and medical problems
- **Pharmacy Finder** — Locate pharmacies with home delivery and 24-hour service filters
- **Lab Search** — Find diagnostic labs with home sample collection options
- **Online Appointments** — Book appointments with doctors at their chambers
- **Provider Dashboards** — Separate dashboards for Doctors, Pharmacies, Labs, and Admins
- **Verification System** — Admin approval workflow for provider registrations
- **Audit Logging** — Complete audit trail for compliance
- **Responsive Design** — Mobile-first UI with dark mode support

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 (Credentials provider)
- **Maps:** Leaflet / OpenStreetMap
- **Storage:** Vercel Blob
- **Cache:** Upstash Redis
- **Email:** Resend

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/techbisu/localdoctor.git
   cd localdoctor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your database URL, auth secret, and other required variables.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `MAP_PROVIDER` | Map provider (`osm` or `google`) |
| `MAP_API_KEY` | API key for map provider (if using Google) |
| `EMAIL_SERVER` | SMTP/Resend configuration |
| `EMAIL_FROM` | Default sender email |
| `STORAGE_PROVIDER` | File storage provider |
| `UPSTASH_REDIS_REST_URL` | Redis REST URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Redis REST token |
| `HCAPTCHA_SECRET` | hCaptcha secret for form protection |
| `NEXT_PUBLIC_HCAPTCHA_SITEKEY` | hCaptcha site key |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (UI + feature)
├── lib/              # Utilities, auth, prisma client
├── server/actions/   # Server Actions for forms/data
├── types/            # TypeScript type declarations
prisma/
└── schema.prisma     # Database schema
```

## User Roles

- **CITIZEN** — Can search providers and book appointments
- **DOCTOR** — Can manage chambers, schedules, and appointments
- **PHARMACY** — Can manage shop profile and services
- **LAB** — Can manage lab profile and available tests
- **ADMIN** — Can approve/reject providers and manage system settings

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

**Required for production:**
- Set all environment variables in Vercel dashboard
- Configure PostgreSQL database (Neon, Supabase, or AWS RDS)
- Run `npx prisma migrate deploy` after deployment

## License

This project is private and proprietary.

## Disclaimer

This platform is for healthcare discovery and appointment booking only. It does not provide medical diagnosis or emergency services. For medical emergencies, please contact your local emergency services immediately.
