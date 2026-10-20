# First production deployment — 2026-10-19

## Verified deployment

- Public URL: https://elan-fragrance-finder.vercel.app
- Immutable deployment URL: https://elan-fragrance-finder-fi955g3yt-andrezza2.vercel.app
- Status: READY; target: production. Public root returned HTTP 200 without authentication or redirects to a login page.
- Deployment ID: `dpl_5sBbewSpLKntHd5KoZUF3zXM994T`.
- Project: `elan-fragrance-finder`, owned by Andrezza (`andrezza2`, Hobby).
- Project ID: `prj_dJoZNXXTvsQxyqds2Gpc74lEFTIt`.
- GitHub connection verified: `AndrezzaNascimento6/elan-fragrance-finder`.
- Inspector: https://vercel.com/andrezza2/elan-fragrance-finder/5sBbewSpLKntHd5KoZUF3zXM994T

Source implementation revision on GitHub main: `53b8573b247b5bcb8ea1cac9553d05eb5767a269`. Its Validate CI run completed successfully: https://github.com/AndrezzaNascimento6/elan-fragrance-finder/actions/runs/39320449377 . Deployment used the authenticated Vercel CLI (`npx --yes vercel deploy --prod --yes --scope andrezza2`) from the same application source, with local deployment ignore/link metadata added. No later product code was implemented.

## Configuration decisions and checks

Repository root `.`, framework Vite, hosted Node `22.x`, install `npm ci`, build `npm run build`, output `dist`. Vercel initially defaulted the project to Node 24; the setting was explicitly changed to Node 22 and verified through the project API. The GitHub repository was connected automatically during project linking.

The production build runs TypeScript and Vite only, consuming generated `src/data/catalog.json`. No backend, serverless function or runtime Python was added. Pandas/preparation remain offline development and CI dependencies. Hash destinations need no host rewrites.

`.vercelignore` excludes local environment files, credentials, dependencies, caches and build/test output. Vercel CLI generated an ignored `.env.local` during linking; it was excluded from the deployment upload. `.vercel` is ignored by Git. No secrets were committed.

Verified the public JavaScript, CSS, catalog JSON, Aube image and both local fonts returned HTTP 200 and matched SHA-256 bytes of the validated local production build. The public HTML references the same built JS/CSS. Vercel inspect confirms Ready and the production alias. These are deployment/asset checks, not actual iPhone, Safari or VoiceOver observations.

## iPhone handoff — pending user validation

Open https://elan-fragrance-finder.vercel.app in Safari and record device model/iOS version.

1. Complete Start → Fresh → Everyday → Citrus → Light → Under $50. Aube should lead with 4/4 matches. All prices must be under $50 and every alternative must show all four evidence dimensions.
2. Try Continue without an answer; verify the error. Use Back and confirm preserved selections.
3. Check font/image loading, natural scrolling, portrait/landscape layouts, safe areas and Safari browser chrome changes, and reachable touch controls.
4. Try Reduce Motion and VoiceOver labels/focus/status where available.

Product details, preference editing, recovery refinements and all later implementation tasks remain outside this deployment request. Product-detail links are not implemented yet. T030 is complete; T031 and subsequent tasks remain unchecked pending the user's real-iPhone observations and further instruction.

## Approved visual redesign production update

The user approved the completed visual redesign and authorized deploying it to the existing `elan-fragrance-finder` project, while keeping all remaining roadmap tasks paused. Published with `npx --yes vercel deploy --prod --yes --scope andrezza2`.

- Production URL: https://elan-fragrance-finder.vercel.app
- Deployment: `dpl_7CpMYA9xBPb4vvTHwPY9pypcfyHV`
- Immutable URL: https://elan-fragrance-finder-ctmt6i6xq-andrezza2.vercel.app
- Vercel API status and readyState: READY; errorCode/errorMessage: null.
- Public root HTTP 200; production alias assigned successfully.
- Approved build verified by exact SHA-256 matches for 36 public assets, including JS/CSS, catalog, all photographic WebPs and local fonts. Ten catalog products use the approved photographic replacements.
- Vite, `npm ci`, `npm run build`, `dist`, no backend/functions/runtime Python retained.

This deployment uploaded the approved current working tree through the existing linked CLI project. The redesign remains uncommitted/unpushed on the local checkout; the GitHub source revision was not advanced during this request. No additional roadmap implementation was performed. Await real-iPhone motion validation from the user.
