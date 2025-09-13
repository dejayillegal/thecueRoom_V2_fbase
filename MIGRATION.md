# thecueRoom – Firebase ➜ Supabase + GitHub Pages Migration (PR-ready)

This patch is designed to be merged into your existing repo. It introduces Supabase
clients, SQL, storage buckets, ENV scaffolding, and GitHub Pages workflow. It does not
alter your UI/UX or branding.

## Apply this patch
1. Download and unzip this archive.
2. Copy its contents into the root of your existing repo (merge/overwrite as prompted).
3. Ensure no `*-firebase-adminsdk-*.json` or Firebase service-account secrets exist anywhere.
4. Commit on a new branch: `feat/supabase-migration` and push.
5. Configure GitHub repo settings for Pages (build from GitHub Actions).

## Environment
Create repo-level Secrets/Variables (Settings → Secrets and Variables → Actions):

Secrets:
- SUPABASE_SERVICE_ROLE  (Server-only key, never exposed)
- SUPABASE_JWT_SECRET    (From Supabase Auth settings)

Variables (or Secrets if preferred):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SITE_URL             # e.g., https://<user>.github.io/thecueRoom_V2_fbase
- NEXT_PUBLIC_BASE_PATH            # e.g., /thecueRoom_V2_fbase
- NODE_VERSION                     # e.g., 20
- PNPM_VERSION                     # e.g., 9

## Local .env files
Copy `.env.example` to `.env` (root and apps/web) and fill values.

## Supabase Setup
- In Supabase: create project, copy URL & anon key.
- Run the SQL files in `supabase/sql/` (order: 01_schema.sql, 02_rls.sql, 03_storage.sql).
- Create storage buckets if not created automatically.

## Build & Deploy
- `pnpm i`
- `pnpm -w build` (SSG export at apps/web/out or repo root out based on config)
- Push to GitHub main; workflow `.github/workflows/pages.yml` will deploy to GitHub Pages.

## Notes
If you had server routes under `app/api/*` relying on Node runtimes, convert to:
- static prebuild JSON under `public/data/*.json`, or
- hosted edge function in Supabase, then fetch via absolute URL.

This patch includes shims to keep import paths stable (see `src/lib/firebase-admin.ts`).
