# Database Migrations

1. Install the Supabase CLI: `npm i -g supabase@latest`.
2. Start the local stack: `supabase start`.
3. Apply migrations from `supabase/sql`:
   ```bash
   supabase db reset --db-url $DATABASE_URL --include-schema
   ```
4. To create a new migration, add SQL files under `supabase/sql` with an incremented prefix.
