# Deploy Web to Vercel

1. Install Vercel CLI: `npm i -g vercel`.
2. Login: `vercel login`.
3. Set project secrets (see `CI_SECRETS.md`).
4. Run `pnpm build`.
5. Deploy: `vercel --prod apps/web`.
