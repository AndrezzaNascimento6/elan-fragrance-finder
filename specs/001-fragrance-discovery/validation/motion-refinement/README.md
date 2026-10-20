# Interaction and motion refinement — approval pending

Scope: the existing discovery slice only. No deployment or remaining product-detail, preference-editing, or recovery tasks were performed.

## Interaction

- ÉLAN is a native Home link on every screen, with keyboard activation and the coordinated view transition. Home resets the current discovery, invalidates pending recommendation responses, and focuses the introduction heading.
- At widths up to 700px, or on a coarse touch device without hover (including landscape), every answer is a native choose-and-continue button. Activating a budget answer submits the completed five-answer snapshot immediately. There is no separate Continue button in this mode.
- Visible instructions and accessible button names explain the continuation. Focus and arrow keys alone do not choose or advance. Back preserves prior choices; the first question's Back returns Home. Desktop retains radios and Continue.
- Navigation commits immediately; animations never gate focus, answer submission, or results. Departing views/questions are inert and hidden from assistive technology.

## Normal-motion choreography

| Moment | Choreography |
| --- | --- |
| Hero photography | Starts at 146% scale, offset 86px horizontally, with a slight rotation; settles over 1.8 seconds. A visible 18-second push/pull loop adds up to 10.5% scale and gentle crop travel while the intro is visible. |
| Hero typography | Headline layers rise 64px with 12-degree depth rotation and separate delays. Script travels 70px horizontally with rotation. The CTA rises 64px from 86% scale with depth rotation. Headline layers separate vertically and horizontally on departure. |
| Enter discovery | The persistent campaign image moves to 119% scale and shifts left 56px/up 28px over 1.1 seconds. Intro type exits while the question enters the same scene. |
| Questions | Forward/backward direction controls 160px incoming and 180px outgoing travel, with scale and Y-axis rotation. Entry lasts 760ms; exit lasts 600ms. Card entrances stagger; photos start at 132% scale and reveal their crop. |
| Selection | The chosen departing card pushes to 122% scale and rises 24px; alternatives recede to 83% scale and dim. The selected image pushes to 130%. Hover/press and progress markers provide additional transform feedback. |
| Processing | The shared camera pushes to 137% scale; the processing atmosphere runs only while processing is present. There is no added loading delay or minimum animation duration. Results render as soon as computation completes. |
| Result | The photo starts at 152% scale with translation and depth rotation, then recedes into its final composition over 1.65 seconds. A light wash, separately moving script/name, staggered match marks, and evidence entrances build the editorial reveal. Subsequent viewport entrances reveal imagery and typography. |

Motion uses Motion for React with transform/opacity animation and CSS microinteractions. No animated blur/filter effects or new dependencies were introduced. Continuous hero movement stops offscreen or when the document is hidden; departing processing stops its loop immediately.

## Reduced motion

Large travel, scale, depth, parallax, and continuous movement are removed. Changes use immediate states or short fades (up to 100ms). Live preference changes are supported. Navigation, focus, readable information, and choose-and-continue behavior remain available.

## Validation

- Unit/component tests: **39 passed**, without unhandled errors.
- Playwright browser tests: **16 passed**, including mobile/desktop navigation, keyboard activation, inactive outgoing content, reduced motion, responsive layouts, and screenshots.
- Python catalog tests: **7 passed**.
- TypeScript check and production build: passed.
- Catalog freshness validation: passed; ranking/domain and Python pipeline logic unchanged by this refinement.
- `git diff --check`: passed.

Screenshots are rendered Chromium captures with mobile emulation, not real-iPhone measurements. Real iPhone frame pacing and VoiceOver remain device validation items after approval; no deployment was performed for this refinement.

## Captures

- [Mobile introduction](mobile-intro.png)
- [Mobile question](mobile-question.png)
- [Mobile recommendation](mobile-recommendation.png)
- [Desktop introduction](desktop-intro.png)
- [Desktop question](desktop-question.png)
- [Desktop recommendation](desktop-recommendation.png)

Still captures show composition; the choreography above and browser interaction coverage document motion behavior.
