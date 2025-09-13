You are an advanced code agent tasked with converting an existing Firebase-based monorepo
(https://github.com/dejayillegal/thecueRoom_V2_fbase) to a Supabase + GitHub Pages deployment,
without changing UI, styles, or logos. Your primary goals are platform and ENV changes only.

Guardrails
- DO NOT change UI components, layout, styling, theming, or the canonical logo.
- Preserve directory structure and TypeScript configs unless incompatible with export.
- Add/modify only what is needed to replace Firebase with Supabase, and to deploy via GitHub Pages.
- Fail builds if any Firebase Admin key or service account JSON is committed.

High-level Tasks
1) Auth: Replace Firebase Auth with Supabase Auth (email+password + magic link).
   - Use @supabase/ssr in Next.js App Router and cookie-based helpers.
   - Provide server client in src/lib/supabase-server.ts and client in src/lib/supabase-browser.ts.
   - Create API routes under app/api/auth/* for session management if absolutely required.
   - Remove all Firebase Admin SDK usage and any server key JSON from codebase.

2) Database: Migrate admin-only REST calls and firestore/rtDB usage (if any) to Supabase Postgres tables.
   - Create tables minimally required by current UI (users/profiles, posts, comments, reactions, playlists, gigs).
   - Enforce RLS policies. Use SQL in supabase/sql/*.sql and run via Supabase SQL editor or CLI.
   - Keep getters APIs unchanged at the component boundary by adding thin "adapter" functions.

3) Storage: If Firebase Storage was used for images/assets, move to Supabase Storage.
   - Buckets: public-assets (logo, icons), user-content (uploads restricted by auth).

4) Build & Deploy: Configure Next.js SSG export to GitHub Pages.
   - next.config.mjs: `output: "export"`, `images.unoptimized = true`.
   - Set `basePath` and `assetPrefix` from ENV when deploying to GitHub Pages (e.g. /thecueRoom_V2_fbase).
   - Add `.github/workflows/pages.yml` to build with pnpm and deploy to Pages.
   - If any SSR-only route exists, rework to static data with prebuild JSON or edge function fallback.

5) ENV: Replace Firebase envs with Supabase envs.
   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE (only used in server-side protected contexts, not committed).
   - NEXT_PUBLIC_BASE_PATH, NEXT_PUBLIC_SITE_URL for GH Pages root and canonical URL.

6) Secrets Hygiene:
   - Never commit service keys. Use GitHub Actions "Secrets and Variables".
   - Add a check step that fails CI if a file matches `*-firebase-adminsdk-*.json` or similar patterns.

Deliverables
- Keep UI identical. Only minimal wiring changes in /src/lib and API route adapters.
- Provide working `pages.yml` workflow and environment examples.
- Provide Supabase SQL schemas and RLS policies.
- The app must build with `pnpm i && pnpm -w build` and static-export with no errors.
- Avoid any dynamic Node APIs in components (SSG only).

Validation
- `pnpm -w typecheck && pnpm -w lint && pnpm -w test` must pass.
- End-to-end smoke: static export produces index.html and assets under `out/`.
- Navigation works under `basePath` when served via GitHub Pages.

Notes
- If a route must remain dynamic, produce a separate Cloudflare Worker or Netlify Function and reference via ENV; do not block Pages export.
- Keep the canonical SVG logo file name and animation exactly as in V1 instructions: `logo.svg` lime fill (#D1E231).
