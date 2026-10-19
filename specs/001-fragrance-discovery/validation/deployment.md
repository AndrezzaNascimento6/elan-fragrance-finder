# Deployment milestone — preparation

Repository: `https://github.com/AndrezzaNascimento6/elan-fragrance-finder` (verified git origin). Read-only GitHub deployments query returned `[]` on 2026-10-19. No Vercel CLI or linked `.vercel` project is present. A Vercel integration is available but was not installed/connected at discovery; connection was suggested. No deployment, remote push or commit has been performed by this implementation session.

T029 configuration: `.github/workflows/validate.yml` runs Python 3.13/Pandas tests and generated-data freshness, Node 22.11 TypeScript/Vitest/build and Playwright/axe against production preview. Workflow definition is present; no remote CI run has yet been observed. Browser results are retained as CI artifacts. Commands have been exercised locally; this does not imply that GitHub CI has passed.

Prepared `vercel.json`: Vite framework, `npm ci`, `npm run build`, output `dist`. The build runs TypeScript and Vite only and consumes checked-in `src/data/catalog.json`; Python/Pandas are offline development/CI dependencies. Browser dependencies and local fonts/images are static assets. Hash routes do not require host rewrites. Select the Node 22 hosting line; hosting patch version may differ from the tested local 22.11.0.

T030 remains pending: connect/import the GitHub repository into the intended Vercel account/project and deploy the checked slice. Record the actual deployed Git SHA, HTTPS URL, build settings and asset/navigation checks here. Do not invent a deployment URL or claim the local uncommitted working tree is on GitHub.

T031 requires actual mobile Safari observations after hosting. Later details, recovery/refinement and final release tasks follow the explicit deployment/device milestones in tasks.md. They have not been marked complete or silently moved ahead of that dependency gate.
