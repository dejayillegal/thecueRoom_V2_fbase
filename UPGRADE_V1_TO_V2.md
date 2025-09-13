# Upgrade from V1 to V2

1. Backup existing environment variables and databases.
2. Apply Supabase migrations from `supabase/sql`.
3. Replace Firebase env vars with Supabase ones in `.env`.
4. Run `pnpm build` and verify deployment.
