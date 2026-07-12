# DisciplineOS Mobile

Standalone Expo mobile app for DisciplineOS AI.

## Start

1. Install dependencies: `corepack pnpm install`
2. Set API URL: `EXPO_PUBLIC_API_URL=http://localhost:4000`
3. Run Expo: `corepack pnpm dev`

## Notes

- This repo is intentionally separate from the main `disciplineos-ai` monorepo.
- The mobile app reuses the existing backend APIs from `../disciplineos-ai/apps/api`; it does not duplicate backend business logic.
- `src/config` holds environment and base URL concerns.
- `src/shared` holds low-level cross-feature utilities like the HTTP client.
- `src/features/auth` owns session persistence, login/signup calls, and auth state.
- `src/features/workspace` owns backend workspace hydration and view selectors.
- Shared types are still copied locally for now to keep the mobile app independent.
