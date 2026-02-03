# Security & Configuration

## Environment Setup

- Copy `.env.example` to `.env` and fill in:
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `PUBLIC_ENV`

## Secrets Hygiene

- Never commit API keys, Supabase dumps, or other credentials.
- Use `pnpm supabase:reset` to reseed local data instead of checking in dumps.
