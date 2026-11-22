<img src="public/images/care-ai-logo.png" alt="CareAI" width="220" />

# CareAI User Web

Next.js (App Router) front end for CareAI: a patient portal and an agent portal, backed by the CareAi .NET API.

## Run locally

Requires Node.js ≥ 20.20.2 and [bun](https://bun.sh/).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000); it redirects to sign-in. The API must be reachable at `CAREAI_API_URL`.

| Script             | What it does                               |
| ------------------ | ------------------------------------------ |
| `bun dev`          | Dev server (Turbopack)                     |
| `bun run build`    | Production build                           |
| `bun run start`    | Serve the production build                 |
| `bun run validate` | Lint, type check, format check, then build |
| `bun run fmt`      | Format with Prettier                       |

## Environment

`.env` holds LOCAL, UAT and PROD blocks with the same keys. Leave one block uncommented. `.env.example` lists the keys.

| Key                       | Purpose                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Public address of this app, no trailing slash. Used for sitemap, `robots.txt` and social previews.                                           |
| `NEXT_PUBLIC_IMAGE_HOSTS` | Optional, comma-separated hostnames `next/image` may load from.                                                                              |
| `CAREAI_API_URL`          | Address of the CareAi API. Server-side only. Required in production.                                                                         |
| `TRUST_FORWARDED_FOR`     | Set `true` only behind a trusted proxy that adds the visitor's IP to `X-Forwarded-For`. Otherwise all visitors share one sign-in rate limit. |

`NEXT_PUBLIC_*` values are fixed at build time: rebuild after changing them.

## How it works

- **Sign-in.** Agents sign in with their Agent ID and patients with their Member ID. Sign-in is a Server Action that stores the API's token in an httpOnly cookie; the browser never sees the token.
- **No signing key here.** The API issues and validates the token on every call. `src/proxy.ts` only redirects visitors without a cookie to `/login`. The portal layout asks the API who the user is (`src/server/session.ts`) and shows a portal only to its own user type.
- **API access.** The browser calls this app's own routes (`src/app/api/*`), which forward to the API with the cookie as a Bearer token. Paths, query names, limits and messages live in `src/config`.
- **Sessions** last 60 minutes and are not refreshed; an expired session goes back to the login page.

## API reference

[docs/API.md](docs/API.md) shows which API each portal screen uses and why, for anyone integrating another client (such as the mobile app).

## Deploying

- Serve over HTTPS: the cookie is `Secure` in production.
- Set `CAREAI_API_URL` and `NEXT_PUBLIC_SITE_URL` in `.env.production` (kept out of git; copy the PROD block from `.env.example`), then run `npm run deploy`. It builds and collects the server into `./deploy`.
- Node host (e.g. Azure App Service, Linux, Node 20 LTS or 22 LTS): upload the contents of `./deploy` to the site root, set the startup command to `node server.js`, and add the app settings `CAREAI_API_URL`, `NODE_ENV=production`, `PORT=8080` and `WEBSITES_PORT=8080`. Never upload `.next` on its own or a local `.env`.
- More than one instance: set the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` on all of them.
- Behind a proxy that rewrites the `Host` header: list the public host in `serverActions.allowedOrigins` (`next.config.ts`), or sign-in is rejected.

## Structure

```
src/
├── app/         Routes, API route handlers (api/), robots, sitemap
├── components/  Auth, portal and shared UI
├── config/      Routes, API endpoints and messages, auth and lead constants, site metadata, demo data
├── lib/         API client, auth helpers, utilities
├── server/      Server-only code: API calls, session, sign-in and sign-out actions
├── services/    Browser-side calls to this app's own routes
├── styles/      Theme, login and portal CSS
└── proxy.ts     Sends signed-out visitors to /login
```

## License

MIT. See [LICENSE](LICENSE).
