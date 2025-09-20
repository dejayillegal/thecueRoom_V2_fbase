# TheCueRoom Codex Constitution

## Mission
Deliver a fast, accessible creative platform across web and mobile using a single TypeScript-first monorepo. Every change must build cleanly, preserve strict typing, and uphold brand identity.

## Core Rules
1. **Zero Firebase.** Do not add Firebase packages, config files, or docs. Run `git grep -nEi "firebase|@react-native-firebase|firestore|apphosting" || echo "✅ No Firebase references"` before shipping.
2. **Supabase Only.** Clients use public anon keys via environment variables (`NEXT_PUBLIC_*`, `EXPO_PUBLIC_*`). Server secrets never belong in client bundles.
3. **Node 20.19.5 + npm 10.** Use `.nvmrc` and keep dependencies reproducible.
4. **React Native Guardrail.** Metro must throw when Node builtins (`fs`, `path`, `url`, `http`, `https`, `zlib`, `stream`, `crypto`, `util`, `net`, `tls`, `events`) are imported in mobile code.
5. **Brand Tokens.** Background `#0B0B0B`, surface `#111111`, lime `#D1FF3D`, purple `#873BBF`, fonts Inter + Source Code Pro.
6. **Strict TypeScript Everywhere.** No `any`, no implicit fallbacks. Favor ESM modules.
7. **Accessible by Default.** Respect reduced motion preferences, provide semantic roles, and preserve contrast.
8. **No TODOs or placeholders.** Ship complete, documented implementations.

## Required Outputs
- Expo 51 mobile app with native-stack navigation, Supabase auth, SVG transformer, Jest smoke tests, and brand-compliant UI.
- Next.js 15 web app with the same design language and strict typing.
- Shell tooling (`scripts/local-setup.sh`, `scripts/dev.sh`) plus environment and SVG docs.
- Root workspace wiring (npm scripts, `tsconfig.json`, `.editorconfig`, `.gitignore`, `.nvmrc`).

## Enforcement Workflow
1. Run `bash ./scripts/local-setup.sh` after cloning to sync dependencies and env files.
2. Validate TypeScript + lint + build using `npm run lint`, `npm run test`, and `npm run build`.
3. Execute the Firebase audit command (see Rule 1).
4. Reject any change that breaks the Node builtin guardrail, brand tokens, or TypeScript strictness.

## Large Asset Embedding Protocol (Future)
When adding large SVG or multimedia assets, split them into Base64 chunks committed as `.part` files with an accompanying assembler script and checksum. Document the assembly steps in `docs/SVG_TRANSFORMER.md` or a sibling note to keep the repo diff-friendly.

## Escalation
If a rule cannot be satisfied, halt the change and escalate with a detailed issue describing blockers, attempted mitigations, and proposed next actions.
