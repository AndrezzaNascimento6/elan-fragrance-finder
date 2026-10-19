# Deployment milestone — preparation

Repository: `https://github.com/AndrezzaNascimento6/elan-fragrance-finder` (verified git origin). Read-only GitHub deployments query returned `[]` on 2026-10-19. No Vercel CLI or linked `.vercel` project is present. A Vercel integration is available but was not installed/connected at discovery; connection was suggested. The discovery slice was committed locally as `e0e2ebb` for the first deployment. Vercel publication remains pending authentication; deployment status will be recorded only after verification.

T029 configuration: `.github/workflows/validate.yml` runs Python 3.13/Pandas tests and generated-data freshness, Node 22.11 TypeScript/Vitest/build and Playwright/axe against production preview. Workflow definition is present; no remote CI run has yet been observed. Browser results are retained as CI artifacts. Commands have been exercised locally; this does not imply that GitHub CI has passed.

Prepared `vercel.json`: Vite framework, `npm ci`, `npm run build`, output `dist`. The build runs TypeScript and Vite only and consumes checked-in `src/data/catalog.json`; Python/Pandas are offline development/CI dependencies. Browser dependencies and local fonts/images are static assets. Hash routes do not require host rewrites. Select the Node 22 hosting line; hosting patch version may differ from the tested local 22.11.0.

T030 remains pending: connect/import the GitHub repository into the intended Vercel account/project and deploy the checked slice. Record the actual deployed Git SHA, HTTPS URL, build settings and asset/navigation checks here. Do not invent a deployment URL or claim the local uncommitted working tree is on GitHub.

T031 requires actual mobile Safari observations after hosting. Later details, recovery/refinement and final release tasks follow the explicit deployment/device milestones in tasks.md. They have not been marked complete or silently moved ahead of that dependency gate.

## First deployment scope and iPhone handoff

User confirmed there is no existing Vercel project and authorized a new project connected to `AndrezzaNascimento6/elan-fragrance-finder`. Use repository root, Vite, `npm run build`, `dist`, Node 22 hosting, no backend/functions/runtime Python. User will validate on a real iPhone after publication. Do not continue product details, preference editing, recovery or later implementation tasks during this deployment request.

On iPhone Safari: record device/iOS version; complete Start → Fresh → Everyday → Citrus → Light → Under $50; confirm Aube leads with 4/4 matches, prices stay under $50, and all alternatives show four evidence dimensions. Check unanswered-question validation and Back preservation, image/font loading, portrait/landscape scrolling, safe areas and browser chrome, reachable touch controls, VoiceOver labels/status where available, and Reduce Motion. Product detail links and editing/recovery are outside this first-deployment scope and are not yet implemented.
