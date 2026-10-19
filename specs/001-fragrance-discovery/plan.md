# Implementation Plan: Élan Fragrance Finder

**Branch**: `main` (actual checkout) | **Feature ID**: `001-fragrance-discovery` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: `specs/001-fragrance-discovery/spec.md` and the user's technical direction. Setup resolved feature ID `001-fragrance-discovery`; it did not change the current `main` branch. No branch creation is part of this plan.

## Summary

Build a static React/TypeScript/Vite experience: five questions, up to three budget-eligible fictional fragrances, evidence-based explanations, deliberate individual edits, and minimal product details. CSV remains the authored catalog; a Python/Pandas preparation command validates it and emits static JSON. Pure TypeScript functions handle normalization, eligibility, ranking, evidence, and result differences. No backend, database, authentication, checkout, AI API, machine learning, customer data, or inventory integration.

This delivery contains design documents only. It ends after Phase 1; implementation and `tasks.md` are subsequent work.

## Technical Context

**Language/Version**: TypeScript 5.x with strict checking; React 19.x; Python 3.12; Node.js 22.12+ in the Node 22 line. Exact compatible dependency patches and lockfiles are selected during implementation, not invented here.

**Primary Dependencies**: React, React DOM, Vite and its React plugin; Pandas for preparation only. Vitest, Testing Library, jsdom, Playwright and axe-core for verification; Python unittest for validator cases. Native CSS, browser history, native form controls; Motion for React (`motion`, imported from `motion/react`) for coordinated transitions, with CSS for simple feedback; no UI framework, global state library or router dependency. The former prohibition on animation packages is removed; the rationale and alternatives are recorded in research.md.

**Storage**: Authored UTF-8 CSV, small shared taxonomy JSON, generated catalog JSON, local image/font assets. React state persists the active visit while navigating product details; no persistent user storage or telemetry.

**Testing**: Pure ranking and evidence unit tests; Python validation tests; component interaction checks; focused browser journeys and automated accessibility scans augmented by keyboard, screen-reader, contrast and responsive review.

**Target Platform**: Responsive desktop/mobile web; current stable Chrome and Safari, actual versions recorded during validation; VoiceOver/Safari manual checks. WCAG 2.2 AA as the accessibility review baseline, plus required reduced-motion support.

**Project Type**: Single static web application with an offline data-preparation utility.

**Performance Goals**: Selection-to-visible-feedback p95 ≤100 ms; submit/apply-to-current-results, empty state or actionable error p95 ≤1,000 ms. Processing feedback is immediate, with no minimum spinner duration or decorative delay. These are engineering acceptance targets informed by human-response guidance, not observed prototype performance; see research and quickstart.

**Constraints**: Integer USD cents, explicit evidence only, immutable inputs, deterministic ties, zero unsupported claims and out-of-band recommendations. Loading or failed updates never present obsolete results as current. Local assets and no third-party runtime requests required.

**Scale/Scope**: Use a small curated fictional catalog sized by scenario coverage: exact matches, partial matches, ties, all preference vocabulary and budget bands, missing-data behavior and empty states, with controlled fixture variants where needed. No fixed product count is required. Five questions, intro, processing, results, empty, error, inline editor, and product detail. Document catalog and fixture coverage explicitly.

## Constitution Check

*Pre-research gate: PASS. Post-design gate: PASS against the contracts and validation guide below. Implementation acceptance remains unverified.*

| Principle | Design evidence / acceptance obligation |
| --- | --- |
| I: Product clarity | Spec stories and SC-001–008 define discovery, trust and refinement outcomes. SC-005/007 have zero-defect targets; SC-006 targets are defined above. Exploratory shopper measures collect distributions and observations rather than invented conversion thresholds. |
| II: Explainability | Four equally weighted comparisons; structured evidence drives every explanation and tie disclosure. |
| III: User control | Preserve answers, inline draft/apply/cancel, no-op handling, reversible edits, product return and truthful change summary. |
| IV: Accessibility | Native radio fieldsets, predictable focus, status announcements, contrast/reflow checks and reduced motion throughout. |
| V: Data integrity | Validated CSV pipeline, shared vocabulary, identity conflict exclusion, unknown tags, defensive runtime loading and disclosure. |
| VI: Maintainability | One app, pure domain functions, small preparation utility; no speculative service layers. |
| VII: Testability | Rule, validator, explanation, interaction, failure and accessibility evidence mapped in quickstart. |
| VIII: Responsiveness | Measurable 100 ms/1 s targets, coverage-driven catalog, actual desktop/mobile conditions and recorded observations. |
| IX: Decisions | Research records alternatives, scope boundaries and unvalidated product hypothesis. |

No constitutional exceptions or amendments are required. Do not claim exploratory usability success or performance compliance before collecting evidence.

## Project Structure

### Documentation (this feature)

```text
specs/001-fragrance-discovery/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── catalog.md
    ├── recommendations.md
    └── experience.md
```

### Planned source code (not created by planning)

```text
data/
├── fragrances.csv
└── taxonomy.json
scripts/
└── prepare_catalog.py
src/
├── main.tsx
├── App.tsx
├── data/
│   ├── catalog.json
│   └── loadCatalog.ts
├── domain/
│   ├── types.ts
│   ├── catalog.ts
│   ├── recommend.ts
│   ├── evidence.ts
│   └── changes.ts
├── components/
│   ├── PreferenceQuestion.tsx
│   ├── PreferenceEditor.tsx
│   ├── FragranceRecommendation.tsx
│   └── ProductImage.tsx
├── views/
│   ├── Introduction.tsx
│   ├── Discovery.tsx
│   ├── Results.tsx
│   └── ProductDetail.tsx
└── styles/
    ├── tokens.css
    └── app.css
public/
├── images/fragrances/
└── fonts/
tests/
├── domain/
├── components/
├── data/
└── e2e/
requirements-data.txt
package.json
package-lock.json
```

**Structure Decision**: One root application with separate domain and preparation code. App-level reducer owns visit state and small hash-based detail navigation (`#/products/<id>`); native Back returns to the preserved finder state without host rewrite rules. Domain functions do not import React, fetch, or read the clock. Taxonomy is shared between preparation and frontend to prevent vocabulary drift. Generated JSON is checked for reproducibility; Python is never shipped to browsers.

## Design and Delivery Boundaries

Detailed contracts specify CSV-to-JSON behavior, rankings, UI transitions and errors. Use local, clearly fictional fragrance imagery with consistent art direction and meaningful descriptions; create or source assets during implementation, never at recommendation runtime. Results lead with an editorial fragrance composition, generous spacing, expressive typography and visible evidence. All recommendations and their evidence must remain easy to browse on mobile; use the deliberate compositions in the experience contract. No generic dashboard shell, commercial boosts or satisfaction percentages.

## Editorial visual and mobile direction

Treat the experience as a premium editorial fragrance campaign: predominantly black or warm-black backgrounds, high-contrast off-white text, restrained champagne/warm metallic accents, thin elegant serif display headings, and readable UI/body typography. Occasional delicate script is decorative only, never essential copy. Use large art-directed local images of fictional fragrance bottles, glass, flowers, ingredients, fabric, texture, light and shadow; generous negative space and few competing elements. Avoid conventional ecommerce grids, dashboard/SaaS cards, neon AI styling and technological motifs. Keep atmospheric ingredient imagery separate from catalog-backed claims.

Design portrait mobile compositions first, especially 390×844, with 320 CSS px reflow and short-height/landscape checks. Intro uses a portrait crop and immediately available Start; questions show one clear heading, answer group, progress and reachable navigation; results lead with a large bottle composition followed by readable evidence and alternatives in a vertical editorial sequence. Avoid a mandatory carousel or swipe-only navigation. The inline editor fits the mobile reading flow with visible Apply/Cancel and all five active preferences available. Desktop may use image/text columns while retaining logical DOM order. Adapt image crops, heading sizes and spacing rather than scaling down desktop. Use safe-area-aware controls, dynamic viewport sizing with natural scrolling, and no fixed-height traps or obscured focus.

## Motion architecture and performance

Motion is part of product communication. Use a small shared set of state-based variants for intro, questions, results and edits; CSS handles simple selection/focus feedback. React state and pure recommendation snapshots remain authoritative; animation callbacks never commit preferences or release results. Use MotionConfig's user reduced-motion policy plus explicit reduced-motion variants and matching CSS media queries. No animation dependency enters domain logic.

Intro combines layered type and product/light reveal; question transitions preserve progress and forward/back direction; processing uses selected words and a brief sensory composition only while actual work is pending. Results are the strongest visual moment: bottle entrance, staggered supporting text/evidence and elegant transitions between vertically browsed products. Editing links the changed preference to recalculation and the actual inclusion/order/evidence differences, with a truthful unchanged-result explanation. Detailed normal/reduced behavior and timing budgets are normative in [experience.md](contracts/experience.md).

Favor opacity/transform and small bounded layers. Bake expensive light/texture into assets; avoid full-screen animated filters, particle engines and mandatory video/WebGL. Stop decorative work when offscreen or hidden. Reserve image space, load responsive images, prioritize the first bottle and defer alternatives. Evaluate LazyMotion's lightweight feature set during implementation and record the production bundle size; do not fetch animation features on the critical result path. First results, readable evidence and controls must paint within existing latency targets, independently of font/image completion and decorative choreography. Profile frame pacing, long tasks and input responsiveness on actual mobile hardware; simplify effects if they jank.

## Implementation sequence and deployment

1. Implement the existing offline data boundary, deterministic TypeScript recommendations and accessible mobile-first vertical slice: Introduction → five questions → real processing state → explained recommendations. Include reduced-motion behavior from the start.
2. Once this slice works end-to-end and its core checks pass, deploy its static Vite output to Vercel from the GitHub source repository. Do not wait for final visual polish or deploy during planning. Use the generated catalog JSON checked into Git; Python/Pandas validation/transformation runs offline/in development or CI, not in the deployed app. Vercel uses npm build tooling and serves `dist`; no backend, database, functions or runtime Python are needed. Preserve hash detail navigation.
3. Use the deployed URL on a real phone for responsive/mobile-browser checks, motion profiling and accessibility review while completing preference editing, recovery and details. Iterate imagery, typography and choreography against observed behavior; screen-record the final deployed experience on a real phone for the short LinkedIn mobile demo after validation/refinement. Keep the MP4 outside the Git repository; it may later be edited externally in iMovie. Store only lightweight tested-build/device documentation for the recording in validation files. GitHub remains the source repository.

## Complexity Tracking

No violations requiring justification. The small browser state machine and runtime validation directly support stale-update, retry and malformed-data requirements; a backend, state framework or generalized recommendation engine has no current justification.
