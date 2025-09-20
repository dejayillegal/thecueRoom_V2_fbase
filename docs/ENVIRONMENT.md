# Environment Setup

This monorepo ships with fully isolated web (Next.js) and mobile (Expo) applications plus shared packages.
Follow the steps below to provision a reproducible local environment with strict typing and zero Firebase dependencies.

## Toolchain Requirements

- **Node.js 20.19.5** (use [`nvm`](https://github.com/nvm-sh/nvm)).
- **npm 10** (bundled with Node 20.19.5).
- macOS, Linux, or WSL2 with Watchman (optional but recommended for React Native).

```bash
nvm install 20.19.5
nvm use
```

## Quickstart

```bash
bash ./scripts/local-setup.sh
```

The script verifies Node 20, installs dependencies for both apps, scaffolds environment files, and reminds you of next steps.

## Environment Variable Matrix

| Variable | Description | File | App |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (anonymous) | `apps/web/.env.local` | Next.js web |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous client key | `apps/web/.env.local` | Next.js web |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (anonymous) | `apps/mobile/.env` | Expo mobile |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous client key | `apps/mobile/.env` | Expo mobile |
| `DRIZZLE_DATABASE_URL` | Connection string for local tooling (e.g., migrations) | `packages/db/.env` | Shared (Node tooling only) |

> **Note:** Client apps only read public anon keys. Keep service-role secrets on the server side—never commit them.

### Example `.env` Files

`apps/web/.env.example`
```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
```

`apps/mobile/.env.example`
```bash
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
```

`packages/db/.env.example`
```bash
DRIZZLE_DATABASE_URL="postgres://postgres:postgres@localhost:5432/thecueroom"
```

## Supabase Auth Configuration

1. In the Supabase dashboard, open **Authentication → URL Configuration**.
2. Set **Site URL** to your local web host (e.g., `http://localhost:3000`).
3. Add **Additional Redirect URLs**:
   - `http://localhost:3000`
   - `thecueroom://login`
4. Under **Authentication → Providers → Email**, enable **Magic Link (passwordless)** and **One-Time Password (OTP)**.
5. In **Authentication → Settings → Auth Flow**, ensure that the magic link emails redirect to `thecueroom://login` for the Expo app and `http://localhost:3000` for the web app.
6. (Optional) Configure **deep link domains** in your Expo dev client as `thecueroom://` so the login screen receives the redirect.

## Local Development

```bash
# Run Next.js and Expo side by side
bash ./scripts/dev.sh
```

- Web app: http://localhost:3000
- Expo DevTools: launched in your terminal/browser. Press `i` or `a` in the Expo CLI to open iOS or Android simulators.

## Testing

```bash
# Mobile smoke tests (Jest + React Native Testing Library)
cd apps/mobile
npm test
```

Additional workspace commands are wired at the root:

```bash
npm run lint
npm run test
npm run build
```

Each command fans out to workspaces that define the respective scripts.

## No Firebase Verification

Run this command to guarantee the repository stays Firebase-free:

```bash
git grep -nEi "firebase|@react-native-firebase|firestore|apphosting" || echo "✅ No Firebase references"
```

It prints `✅ No Firebase references` when the tree is clean.
