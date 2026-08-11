# CI/CD

GitHub Actions workflows for Manuscript.

## Workflows

### CI (`ci.yml`)

Runs on every push and pull request to `main`:

| Step | Description |
|------|-------------|
| Install | `pnpm install --frozen-lockfile` |
| Generate | Prisma Client generation |
| Typecheck | TypeScript across all packages |
| Lint | ESLint (Next.js config) |
| DB sync | `prisma db push` against PostgreSQL service |
| Build | Production Next.js build |

Pull requests additionally run **Migration Check** — validates that the Prisma schema can be applied to a fresh database.

### CD (`cd.yml`)

Runs on push to `main` and manual trigger (`workflow_dispatch`):

| Job | Description |
|-----|-------------|
| Build | Production build + artifact upload (`.next`, 7 days) |
| Deploy | Placeholder — connect hosting provider |

## Required secrets (for deployment)

When ready to deploy to Vercel, add these repository secrets:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Organization ID |
| `VERCEL_PROJECT_ID` | Project ID |

Then uncomment the Vercel step in `.github/workflows/cd.yml`.

## Local commands (same as CI)

```bash
pnpm install
pnpm db:generate
pnpm typecheck
pnpm lint
pnpm build
```
