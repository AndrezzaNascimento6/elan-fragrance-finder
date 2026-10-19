# Phase 0 Research and Decisions

All planning unknowns are resolved below. No application or study results exist yet. Official technology references and primary usability/accessibility guidance were checked on 2026-10-19. Exact dependency patches remain an implementation lockfile responsibility, not a product uncertainty.

## Static frontend and state

**Decision:** React with strict TypeScript, Vite static output, native CSS and app-level reducer. Keep applied preferences, draft edits and the last successful snapshot distinct; derive scores/evidence instead of duplicating them in component state. Use small native hash navigation for detail views and preserve visit state above that view.

**Rationale:** The journey is small, local and does not need server rendering or global state infrastructure. Reducer transitions make editing and latest-request protection reviewable. A static JSON fetch permits explicit loading/retry paths without adding a service.

**Alternatives considered:** Full-stack framework, SSR, router package, global store and inline ranking in components add unnecessary scope or make rules harder to test. Importing JSON directly would remove the ordinary retryable loading boundary; a static asset fetch better exercises required recovery.

Sources: [React state structure](https://react.dev/learn/choosing-the-state-structure), [React reducers](https://react.dev/learn/extracting-state-logic-into-a-reducer), [Vite static deployment](https://vite.dev/guide/static-deploy.html).

## CSV validation and runtime boundary

**Decision:** Pandas reads explicit strings with automatic NA conversion disabled. Parse nested arrays explicitly; Decimal validates USD strings and emits integer cents. Share a small canonical taxonomy JSON. Strict preparation rejects invalid source rows with diagnostics; explicit exclusion mode is reserved for controlled demo/fixture variants. Browser validation still excludes damaged records defensively.

**Rationale:** String ingestion avoids altered identities and accidental missing-value interpretation. Explicit categories prevent scent inference. Grouping by identity before eligibility avoids accidentally retaining one side of a conflict. Runtime validation handles corrupted or manually altered JSON even when normal preparation fails closed.

**Alternatives considered:** Excel/manual JSON as primary data loses the requested CSV workflow; implicit dtype inference and floats complicate boundaries; dropping the first duplicate hides conflicts. Always publishing partially invalid authored data would conceal editorial mistakes; always treating runtime partial data as a fatal error would violate specified partial-data behavior. Header-only data is deliberately empty; wholly unusable nonempty data is an error.

Sources: [Pandas read_csv](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html), [duplicate detection](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.duplicated.html), [Python Decimal](https://docs.python.org/3/library/decimal.html).

## Ranking and explanations

**Decision:** Four equal points, budget as a strict prefilter, minimum one point; sort score descending then stable ASCII ID ascending. Build explanation copy from typed evidence for every dimension. Compare run snapshots for change summaries.

**Rationale:** Directly implements FR-004–012 and supplies the previously unspecified tie rule. Identity sorting stays stable under catalog row permutations and does not imply a price or commercial preference.

**Alternatives considered:** Price tie-breaks imply an unrequested value preference; row order hides editorial ranking influence; random tie order prevents restoration; fuzzy/weighted models and runtime text generation obscure the defined evidence rules. Product requirements, not external algorithms, govern this decision.

## Testing approach

**Decision:** Vitest for pure logic, Testing Library for interactions, Playwright/axe for focused browser checks, unittest for preparation. Select compatible current versions at implementation with Node 22.12+ and lock them; run tests once in validation rather than relying on watch mode.

**Rationale:** Ranking runs without rendering; Python fixtures isolate data defects; browser tests prove the complete journey and race handling. Manual accessibility review is still required.

**Alternatives considered:** Browser-only tests obscure rule failures; unit-only checks miss focus and recovery. A large generalized test harness is unnecessary.

Sources: [Vitest guide](https://vitest.dev/guide/), [Testing Library principles](https://testing-library.com/docs/guiding-principles/), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).

## Response-time targets and validation conditions

**Decision:** Set p95 ≤100 ms from a selection/action to visible feedback and p95 ≤1,000 ms from completed submission or applied edit to current results, empty or actionable error under healthy test conditions. Render processing feedback promptly and never add a minimum wait. Do not wait for image decoding or font downloads to show textual results. Record image completion separately.

**Evidence basis:** Nielsen's original response-time guidance identifies roughly 0.1 second as immediate feedback and 1 second as preserving flow. Applying those human-perception boundaries to p95 is this plan's engineering decision, not a benchmark prescribed by that research and not evidence that this prototype already meets them.

**Conditions:** A 24-record local fictional catalog with all vocabulary and budget bands; controlled variants cover 0/1/2 results, ties, corruption and missing data. Production Vite build served locally, warm application shell. Desktop Chrome at 1440×900 with no CPU/network throttling; mobile Chrome emulation at 390×844 with 4× CPU slowdown and configured 1.6 Mbps download / 750 Kbps upload / 150 ms latency. Record host hardware, OS, actual browser versions and throttling settings. Confirm usability on an actual mobile Safari device and record model/version separately; do not equate emulation with hardware evidence.

Collect 30 selection, submission and edit samples per condition, report p50/p95/max and raw observations, separate cold/warm catalog loads, errors and empty states. Begin measurement at action dispatch and end after the relevant committed state paints (browser instrumentation around the render/next animation frame, calibrated against trace/screenshots). Record methodology limitations. A stalled network is separately exercised with a 5-second timeout to verify recovery, not mixed into healthy-network latency percentiles.

**Alternatives considered:** Arbitrary demo delays impair responsiveness; timing only the ranking function misses loading and paint. Unsupported conversion or shopper-completion targets would pretend evidence exists. No invented usability success threshold is added.

Source: [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/).

## Editorial visual and mobile composition

**Decision:** Make the dark premium campaign direction and portrait mobile demo composition explicit design obligations. Use off-white text, restrained champagne accents, elegant serif headings, occasional decorative script, atmospheric local product/ingredient imagery, and generous space. Design mobile screens independently; use vertically browsed editorial recommendations with complete evidence, rather than a required carousel. Desktop adapts to wider image/text compositions.

**Rationale:** The primary portfolio recording showcases mobile. A minimal static composition can support cinematic state changes while preserving readable recommendation reasoning and deliberate editing. Script cannot carry labels or evidence. Imagery never creates fragrance attributes absent from the catalog.

**Alternatives considered:** Shrinking a desktop grid loses art direction and touch usability; dashboard cards, neon AI motifs and storefront clutter conflict with the brief. Swipe-only browsing hides controls and evidence. Mandatory full-screen video adds download and rendering costs without serving recommendation clarity.

## Motion orchestration and accessibility

**Decision:** Recommend Motion for React (`motion`, `motion/react`) for shared state variants, coordinated entrances/exits and bounded result layout changes; CSS remains appropriate for simple feedback. Use AnimatePresence only where departing layers can be removed from interaction/accessibility immediately; never wait for exit completion to show current results. Consider LazyMotion with the smallest required feature set after measuring the production bundle. Lock a compatible version at implementation; no package is installed in planning.

**Rationale:** Multiple coordinated state transitions now justify one React animation dependency. Shared variants keep choreography and reduced-motion behavior consistent across discovery and editing. This is a maintainability choice for the requested interactions, not novelty. State changes, focus and status remain independent of animation. MotionConfig with reducedMotion="user" handles transform/layout policy; useReducedMotion and CSS media queries explicitly replace blur, atmospheric loops and other effects the global policy alone does not remove. Respond to preference changes during the visit.

**Alternatives considered:** CSS-only is smaller but makes coordinated keyed exits, interruptions and reorder transitions harder to maintain here. Browser View Transitions alone adds capability/fallback handling for this choreography; a large imperative timeline/3D stack adds complexity without a current requirement. No animation is too restrictive for the evolved brief; unrestricted animation would undermine responsiveness and accessibility.

**Performance decision:** Prefer transforms/opacity, baked texture/light, limited layers and responsive assets. No fake processing duration; a fast computation may bypass the sensory interlude. Existing 100 ms/1 s p95 targets include readable state paint, not just calculation. Profile mobile frame pacing and interruption behavior with production assets; seek smooth rendering near the device refresh rate and investigate visible stutter or interaction long tasks before acceptance. These are future checks, not measured claims. Full timing and reduced-motion alternatives are in the experience contract.

Sources checked for this refinement on 2026-10-19: [Motion animation and presence](https://motion.dev/docs/react-animation), [Motion accessibility policy](https://motion.dev/docs/react-accessibility), [reactive reduced-motion hook](https://motion.dev/docs/react-use-reduced-motion), [LazyMotion](https://motion.dev/docs/react-lazy-motion), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Static deployment milestone

**Decision:** Deploy to Vercel during implementation immediately after the first checked, working intro → five questions → processing → recommendations slice. Keep GitHub as source; build static Vite `dist` with prepared JSON and local assets. No deployment is performed in planning.

**Rationale:** A hosted URL enables actual phone, mobile browser, motion and accessibility review throughout refinement, and later a polished LinkedIn recording. Hash navigation retains simple static hosting. Offline Python/Pandas preparation and CI validation remain distinct from hosting; Vercel does not need a Python runtime or backend.

**Alternatives considered:** Waiting until final polish delays mobile evidence; local preview alone cannot replace deployed-device checks. Adding server infrastructure or changing frameworks solely for hosting is unnecessary.

Source: [Vercel Vite deployment and Git previews](https://vercel.com/docs/frameworks/frontend/vite).

## Hypothesis and remaining empirical work

The product hypothesis remains unvalidated: familiar questions and a small explained result set may aid confident exploration. Implement only the journey needed to test SC-001–004/008. Record participant count, denominators, timing distributions, confusion, disagreements with tags, assistance and confidence changes; collect no real customer dataset or production analytics. Revise wording, tags or interaction choices when contrary evidence appears. No unresolved technical clarification blocks design; usability and measured performance remain future validation work.
