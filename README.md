# CareAI User Web

Next.js App Router front end for **CareAI** — patient and agent portals for healthcare journeys (second opinions, expert consults, overseas treatment, and case management).

## Quick start

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to sign-in).

| Step | Command | What it does |
| ---- | ------- | ------------ |
| 01 | `bun install` | Dependencies + Husky hooks |
| 02 | `bun dev` | Turbopack dev server |
| 03 | `bun run validate` | Lint, types, Prettier, production build |

Node.js ≥ 20.20.2. Uses [bun](https://bun.sh/) by default.

## Configuration

- **`src/config/site.ts`** — app name, description, SEO defaults, canonical base URL
- **`NEXT_PUBLIC_SITE_URL`** — production site URL (no trailing slash); see `.env.example`
- **`NEXT_PUBLIC_IMAGE_HOSTS`** — optional comma-separated hostnames for `next/image`

## Scripts

| Script | Description |
| ------ | ----------- |
| `dev` | Dev server (Turbopack) |
| `build` | Production build |
| `start` | Serve production build |
| `validate` | Lint + format check + build |
| `fmt` | Prettier write |

## Structure

```
src/
├── app/                 # Routes, layouts, robots, sitemap
├── components/          # Auth and portal UI
├── config/              # site, auth, navigation, mock data
├── hooks/               # Session helpers
├── lib/careai/          # Session storage
└── styles/              # CareAI theme and portal CSS
```

## License

MIT. See [LICENSE](LICENSE).
