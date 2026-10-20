# Discovery slice visual redesign — approved and deployed

The user's attached Élan campaign reference is the primary visual source of truth for this work. The user approved the redesign and explicitly authorized its production deployment. Remaining roadmap tasks stay paused. The approved working-tree redesign was deployed directly through the existing linked Vercel CLI project; it has not been committed or pushed to GitHub during this deployment request. Product details, preference editing and recovery extensions were not implemented.

## Implemented visual direction

Warm-black full-bleed photographic hero, dramatic amber/champagne light, very large Cormorant serif hierarchy, locally served OFL Allura script accents, larger supporting copy, thin warm borders/dividers, pill-shaped champagne and dark buttons, SVG-only control icons, photographic feeling cards and responsive editorial recommendations. Mobile uses intentional portrait crops, two-column feeling options and large vertical product photography. Product identity/price/match information precedes its photograph in the mobile reading order; complete evidence and all five active preferences remain visible. Minimal brand navigation uses existing discovery and explanatory sections only.

## Photography and provenance

Built-in image_gen generated 15 distinct photographic-style assets: one campaign hero, four atmospheric mood images and ten individually labeled fictional product images. No external image API key or fallback CLI was used. Every original was inspected; the chosen outputs are encoded as local WebP assets with 640px derivatives. Full product assets are 1024×1536; campaign/mood sources are 1536×1024. The ten old product illustrations were removed; only the validator's separate SVG fixture remains.

Saved assets: `public/images/campaign/{hero,feeling-fresh,feeling-warm,feeling-elegant,feeling-bold}.webp` and `public/images/fragrances/{aube,brume,clair,fleur,velours,terre,sillage,nuit,rosee,peau}.webp`, each with a `-640.webp` variant. The exact prompt set, generated source provenance and output paths are in [asset-prompts.json](asset-prompts.json). Allura font and license are in `public/fonts/`.

Exact original photographic files and precise typeface files used by the reference were not supplied. Generated images and licensed fonts reproduce the composition and art direction, rather than exact original asset identity. No missing product photograph or illustrated placeholder blocks review. Photography is synthetic and the collection remains fictional. Atmospheric hero/mood elements add no catalog claims.

## Motion implemented

- Hero image: 8% scale settle over 1.2 seconds; decorative script fade; staggered 28px heading/copy entrances.
- Start and question changes: immediate view commitment with directional 44px question entrance over 480ms; obsolete controls are removed immediately.
- Progress: 450ms line fill, selected step markers and preserved Back state.
- Options/controls: subtle hover lift, press compression, photographic selection zoom, explicit Selected text and SVG check mark; pill surfaces have restrained highlights and shadow.
- Processing: orbit composition and selected-word movement only during actual pending work. No artificial loading delay. The browser test holds a catalog response solely in the harness to inspect this state.
- Recommendations: viewport-triggered photographic 7% scale/20px entrance over 900ms, editorial text entrances and user-directed smooth in-page navigation with clear circled chevrons. Offscreen photo work is stopped; hidden-document policy removes spatial work.

Reduced motion removes scale, translation, loops, smooth scrolling and CSS selection zoom; short/static equivalents preserve all controls and information. A matchMedia subscription supplements the installed Motion hook's initial-state-only behavior, so changes during the visit take effect without reload. Text, preference commits, result calculation, focus and live announcements never wait for animation or images.

## Observed verification

Existing local Node 22.11.0, Python 3.13.1/Pandas 2.3.3; strict TypeScript and Vite 6.4.4. Checks passed:

- Python unittest: 7 tests.
- Vitest: all 37 existing domain/loading/component tests.
- Playwright: all 6 existing desktop/mobile scenarios plus 6 targeted redesign/capture/processing scenarios = 12 passed.
- Production build, TypeScript, generated-data `--check`, and `git diff --check`.
- Browser checks include axe, required selections, Back preservation, heading focus, keyboard completion, 320px/390px/landscape/desktop reflow, mid-visit reduced-motion changes, selected states, SVG affordances, and terminating continuous processing motion when reduced motion is enabled.

A structural comparison against the committed catalog proved that all IDs, names, prices, currencies, notes/categories, intensities, tags, product destinations and diagnostics are identical. Only image references/descriptions changed through the existing Pandas pipeline. `src/domain/` and `scripts/prepare_catalog.py` are unchanged.

## Review captures

- [Mobile 390×844](mobile-review.png), [desktop 1440×1086](desktop-review.png).
- [Full mobile introduction](mobile-full.png), [full desktop introduction](desktop-full.png).
- [Feeling question, mobile](feeling-mobile.png), [desktop](feeling-desktop.png).
- [Recommendation, mobile](recommendation-mobile.png), [desktop](recommendation-desktop.png).
- [Complete mobile results](results-mobile.png), [complete desktop results](results-desktop.png).
- Processing and selected-question captures are also saved in this directory.

These are actual Chromium production-preview captures, including mobile viewport emulation. They do not establish real iPhone/Safari performance or VoiceOver results. No new real-device observation is claimed. Visual approval was received and production publication is complete. Await the user's real-iPhone motion review before any further implementation.

## Approved production verification

Production URL: https://elan-fragrance-finder.vercel.app . Deployment `dpl_7CpMYA9xBPb4vvTHwPY9pypcfyHV`, immutable URL https://elan-fragrance-finder-ctmt6i6xq-andrezza2.vercel.app , target production, readyState/status READY, with no deployment error. The public root returned HTTP 200.

Live HTML references `/assets/index-C4TD7Skl.js` and `/assets/index-lAUyT9uL.css`, matching the approved local production build. SHA-256 comparison succeeded for 36 public assets: compiled JS/CSS, generated catalog, all 30 photographic full/responsive WebPs, and three local fonts. The deployed catalog contains all ten photographic products. No application source or remaining roadmap task was changed during deployment.
