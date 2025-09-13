# Developer Guide

1. Clone the repo and run the setup script:
   ```bash
   pnpm setup
   ```
2. Start the web app:
   ```bash
   pnpm --filter ./apps/web dev
   ```
3. Run tests and lint before committing:
   ```bash
   pnpm lint && pnpm test && pnpm build
   ```
