# Feature Specification: Élan Fragrance Finder

**Feature Branch**: `main` (existing branch; no branch-creation hook configured)

**Created**: 2026-10-19

**Status**: Draft — validated for planning

**Input**: User brief for a small fictional fragrance discovery experience with five questions, up to three explainable recommendations, strict budget eligibility, and editable preferences.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover understandable recommendations (Priority: P1)

As a shopper without fragrance expertise, I want to answer familiar questions and see a small set of relevant fragrances with understandable reasons so I can choose a product to explore.

**Why this priority**: Delivers core discovery value and qualified engagement without catalog browsing.

**Independent Test**: Complete the questions against a known fictional catalog and compare results, order, details, and explanations with catalog evidence and documented rules.

**Acceptance Scenarios**:

1. **Given** the initial screen, **When** I start, **Then** I see question one of five, its options, and progress without needing fragrance terminology.
2. **Given** Fresh, Everyday, Citrus, Light, Under $50 selections and a $49 product explicitly matching all four non-budget preferences, **When** I finish, **Then** that exact match ranks ahead of partial matches and its explanation identifies all four matches and budget compliance.
3. **Given** at least three eligible products, **When** results appear, **Then** exactly three distinct products appear with name, image, key notes, intensity, price, match indicator, explanation, and a product-detail action.
4. **Given** an unanswered question, **When** I attempt to continue, **Then** I remain there and receive an instruction to select an answer.
5. **Given** completed answers, **When** I go back and change one, **Then** other answers remain selected and results use the latest answers.
6. **Given** completed answers, **When** recommendations are prepared, **Then** I receive processing feedback followed by results, an empty state, or a recoverable error; obsolete results are never presented as current.
7. **Given** a recommendation, **When** I open its product details, **Then** I reach the corresponding fictional product with catalog-consistent information and can return to my preferences and results.

### User Story 2 - Understand alternatives and recover (Priority: P1)

As a shopper, I want honest alternatives and useful recovery actions when the catalog cannot satisfy my preferences.

**Why this priority**: Budget integrity and visible limitations preserve trust.

**Independent Test**: Use controlled catalog variants with partial matches, zero to two eligible products, price boundaries, and incomplete records.

**Acceptance Scenarios**:

1. **Given** no exact match and a product matching Fresh, Everyday, Citrus but having Balanced intensity, **When** I selected Light, **Then** it can appear as a 3-of-4 match and explicitly says Balanced instead of Light.
2. **Given** only one or two eligible products, **When** results appear, **Then** only those products appear with an explanation that fewer than three were found, without duplicates or out-of-budget fillers.
3. **Given** prices $49.99, $50, $99.99, and $100, **When** each budget is tested, **Then** only prices in its defined band are eligible regardless of other matches.
4. **Given** no eligible products, including affordable products matching zero preferences, **When** I finish, **Then** I see no recommendations, an honest explanation, and preference-editing actions without restarting.
5. **Given** missing price or required display data, **When** recommendations are generated, **Then** that product is excluded; a missing feeling or occasion attribute counts as unknown, never as a match.
6. **Given** incomplete or partial evidence, **When** explanations appear, **Then** every positive claim has catalog support and every unmet or unknown preference is disclosed without invented product qualities.
7. **Given** a recoverable failure, **When** I retry, **Then** my selections remain available, the latest selections govern results, and editing is also available.

### User Story 3 - Refine one preference (Priority: P2)

As a shopper reviewing results, I want to change one preference and understand its effect without restarting.

**Why this priority**: Validates meaningful control with less decision effort.

**Independent Test**: Begin with known results, edit only intensity or budget, and verify new results and the change explanation.

**Acceptance Scenarios**:

1. **Given** results and five visible active preferences, **When** I apply an intensity change, **Then** the other four answers remain unchanged and products, order, indicators, and explanations reflect the applied answer.
2. **Given** a pending edit, **When** I cancel, **Then** the original selection and results remain in effect.
3. **Given** an applied change, **When** results update, **Then** the interface names the changed preference and explains its effect on product inclusion, ordering, or match evidence.
4. **Given** an edit leaving products and order unchanged, **When** results update, **Then** the interface explicitly explains that outcome and updates any affected evidence.
5. **Given** an empty state, **When** I edit budget or another preference, **Then** all other answers are preserved and eligibility is recalculated.
6. **Given** an applied edit, **When** I restore the previous answer, **Then** an unchanged catalog produces the original order and evidence.

### User Story 4 - Complete the journey accessibly (Priority: P1)

As a keyboard or assistive-technology user, I want to complete discovery and refinement with understandable controls and feedback.

**Why this priority**: Accessibility applies to every required state.

**Independent Test**: Complete discovery, back navigation, product navigation, editing, empty-state recovery, and error retry using only a keyboard; review labels, hierarchy, focus, and announcements with assistive technology.

**Acceptance Scenarios**:

1. **Given** any required state, **When** I navigate by keyboard, **Then** every action is operable in logical order with visible focus and no focus trap.
2. **Given** answer options, **When** I select one, **Then** a visible mark or text and an accessible selected state identify selection independently of color.
3. **Given** question changes, processing, results, errors, or empty states, **When** they appear, **Then** their headings, status, and recovery actions are understandable with assistive technology and focus remains predictable.
4. **Given** mobile or desktop layouts, **When** I complete the journey, **Then** all content and controls remain available without horizontal page scrolling, and reduced-motion preferences are respected.

### Edge Cases

- Budget bands do not overlap: Under $50 means price < $50; $50–under $100 means $50 ≤ price < $100; $100+ means price ≥ $100. The labels themselves make clear that $100 belongs to $100+.
- More than three exact matches and other equal-match ties must produce a repeatable selection and order: identical preferences and catalog always produce identical results. The technical tie-break method is a planning decision.
- One exact match leads eligible partial matches, which fill remaining slots. Zero-match products never fill slots.
- Unknown feeling or occasion evidence is described as unspecified, not as an established mismatch.
- Missing, invalid, negative, or non-USD prices prevent eligibility. Missing identity, name, image reference, image description, key notes/categories, valid intensity, or product destination also prevents eligibility. Conflicting records for one identity are excluded; repeated identical records are deduplicated.
- A failed image load displays a labeled unavailable-image fallback without invented imagery; known product information remains visible.
- Rapid edits cannot allow an older result to replace the latest requested result. Reapplying the same answer must not claim a change occurred.
- A valid catalog with no suitable products produces an empty state; an unreadable or wholly unusable catalog produces a recoverable error with retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Introduce Élan Fragrance Finder as fictional preference-based decision support, explain the five-question flow, and provide a start action. Do not guarantee personal satisfaction.
- **FR-002**: Require one answer per question in this order: feeling (Fresh, Warm, Elegant, Bold); occasion (Everyday, Work, Date night, Special occasions); notes (Citrus, Floral, Woody, Sweet, Spicy); intensity (Light, Balanced, Intense); budget (Under $50, $50–under $100, $100+). Show progress, preserve answers on back navigation, and explain missing selections.
- **FR-003**: Support initial, question, processing, results, no-suitable-results, recoverable-error, and post-results editing states, with clear status and appropriate next actions.
- **FR-004**: Consider only fictional products with valid required information within the selected budget band. Budget MUST NOT be relaxed automatically.
- **FR-005**: Count a preference match only when explicit catalog feeling tags, occasion tags, note categories, or intensity support it. Note categories must be explicitly associated with named key notes. Never infer unsupported properties or use gender categorization.
- **FR-006**: Give each of the four non-budget preferences equal weight: one for a supported match, zero for a mismatch or unknown. Require at least one match for eligibility. Rank by descending count. Resolve equal counts deterministically so unchanged preferences and catalog produce the same selection and order; planning will specify the technical tie-break method. Four matches constitute an exact match. No hidden weights or commercial boosts are permitted; similar scores favor more matched preferences.
- **FR-007**: Show the first three distinct eligible products, or all eligible products if fewer than three. Explain reduced counts. Show an actionable empty state when none qualify.
- **FR-008**: Display each recommendation's name, image with meaningful alternative text, key notes, intensity, USD price, match indicator, concise explanation, and labeled link to corresponding fictional product details. Handle failed images as defined in Edge Cases.
- **FR-009**: Use an indicator such as “Matches N of 4 preferences,” identifying exact or partial matches in words and displaying budget compliance separately. Explain matching selections using catalog evidence and disclose every unmet or unknown preference. Make rank understandable through match count; for tied products, make clear that they match the same number of preferences without implying that their relative order reflects stronger suitability. Do not present match counts as probabilities of satisfaction.
- **FR-010**: Apply the missing-data exclusions in Edge Cases. Unknown feeling/occasion fields must never become known matches. When incomplete records affect results, disclose that some catalog information is unavailable without inventing details or claiming missing values are mismatches.
- **FR-011**: Show all active preferences on results and empty states. Permit individual editing with apply and cancel, preserve other answers, refresh results and evidence, explain changed or unchanged outcomes, and allow restoration of a prior answer.
- **FR-012**: Latest applied preferences govern current results. Clearly distinguish processing and failed updates from successful results; retain answers and provide retry and edit actions. If old results remain visible, label their relationship to the last successful selections.
- **FR-013**: Provide keyboard operation, logical focus, visible focus, meaningful labels, understandable headings, sufficient text/control contrast, and selection cues beyond color. Make status changes perceivable with assistive technology. Errors and empty states must explain recovery.
- **FR-014**: Preserve content and controls on mobile and desktop, respect reduced motion, and provide responsive feedback without decorative delays; measure responsiveness as described in SC-006. Evidence-based response-time targets and validation conditions must be documented during planning before implementation.
- **FR-015**: Preserve preferences and results when returning from product details within the active visit. Exclude authentication, checkout, payments, real inventory, real customer data, purchase-history personalization, production machine learning, and gender-based categorization.
- **FR-016**: Retain reproducible verification of ranking, ties, boundaries, missing data, and explanation consistency, including automated rule checks during implementation. Record interaction, accessibility, and response-time evidence for affected flows before implementation completion.

### Key Entities *(include if feature involves data)*

- **Fictional catalog**: Curated fragrance records; sole source of recommendation evidence and product claims.
- **Fragrance product**: Stable identity, name, fictional image with description, named key notes with explicit note categories, intensity, USD price, fictional product-detail destination, feeling tags, and occasion tags. All except feeling/occasion tags are required for eligibility.
- **Preference set**: One active answer for each question and any pending edit. Budget governs eligibility; four other selections determine match count.
- **Recommendation**: Eligible product, rank, matching evidence, mismatches, unknown preferences, budget compliance, and explanation.
- **Preference change**: Previous and applied answer, changed question, and resulting differences in inclusion, order, or evidence, including unchanged outcomes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Validation will observe shoppers who self-report limited fragrance knowledge. Record participant count, study conditions, task outcomes, observed difficulties, and assistance given. Report counts and rates with their denominators and timing distributions where relevant. Sample size, numeric success thresholds, and response-time targets are not established by this specification; any later targets require a documented evidence basis. Behavioral correctness and accessibility requirements remain acceptance obligations.

- **SC-001**: Observe whether participants complete discovery and identify a product to explore without assistance. Measure elapsed time from Start to product-detail selection, completion and abandonment by step, and where assistance is needed.
- **SC-002**: Ask participants why each displayed fragrance was recommended. Record whether their explanations agree with catalog evidence, whether they recognize disclosed mismatches or unknowns, and which wording causes confusion.
- **SC-003**: Observe participants changing one preference after results. Record completion, elapsed time, assistance, whether they restart unnecessarily, and whether they understand changed or unchanged results. Ask whether editing feels easier than restarting and record their reasoning.
- **SC-004**: Observe recovery from seeded no-exact-match and no-suitable-results cases. Record whether participants understand alternatives, find and use editing actions, recover without assistance, and understand that recommendations do not guarantee personal satisfaction.
- **SC-005**: Acceptance checks show zero out-of-budget recommendations and zero unsupported explanation claims. All specified exact/partial/tie, result-count, boundary, missing-data, edit, and recovery cases produce their expected outcomes.
- **SC-006**: Measure time from selection to visible feedback and from completed submission or applied edit to current results or an actionable terminal state. Record timing distributions, delayed or stale updates, and observed uncertainty or repeated actions during waiting. Use a representative small fictional catalog and document its size and coverage, device, browser, connection conditions, and number of observations on mobile and desktop. Planning must use available evidence to define justified latency targets and representative validation conditions before implementation; this specification assigns no numeric benchmark.
- **SC-007**: Every action in all four stories is completed by keyboard with zero unreachable actions or focus traps. Recorded assistive-technology and visual reviews verify labels, hierarchy, focus, selected states, contrast, status announcements, and recovery on mobile and desktop.
- **SC-008**: Collect confidence in choosing a product to explore before and after discovery using the same question and response scale. Report individual changes and participants' explanations, including whether the small result set reduces decision complexity or implies unsupported certainty. Do not claim causal improvement from exploratory validation.

### Future Production Measurement Goals

The table defines what each future metric measures, not a target value. Production tracking is outside this prototype. No baseline, target value, or uplift is established for any metric; future targets require evidence and a separately documented decision.

| Signal | Definition |
| --- | --- |
| Completion rate | Visits reaching first successful results or no-suitable-results / visits starting question one; report successful-recommendation rate separately. |
| Recommendation-to-product-page click-through | Visits opening a recommended product / visits shown recommendations. |
| Add-to-cart from recommendations | Visits adding a product opened from recommendations / visits shown recommendations; future cart-enabled experience required, with attribution within the same visit. |
| Preference adjustment | Visits applying at least one changed preference after results / visits shown results. |
| Abandonment by step | Visits leaving with that question as their furthest reached unanswered step / visits reaching that step, excluding completions; define visit timeout before production tracking. |

## Assumptions

### Product Context and Scope

- The user problem is translating personal preferences into fragrance choices without expert terminology. The business objective is qualified engagement with relevant product pages while preserving trust. Five familiar questions and at most three explained options directly support both.
- English-language copy and USD prices are defaults. Answers persist within the active visit; cross-device and later-visit persistence are excluded.
- The prototype uses a small curated fictional catalog and minimal corresponding detail views. Catalog size is determined by coverage of exact matches, partial matches, ties, missing data, and empty states, using controlled variants where needed; no fixed product count is required. A large catalog and complete storefront are excluded.
- Dependencies are fictional records, fictional image assets, explicit preference tags/note categories, product-detail destinations, and controlled catalog variants for validation. No external product or inventory service is needed.

### Product Decisions and Trade-offs

| Decision | Alternative considered | Selected default and rationale |
| --- | --- | --- |
| Notes selection | Multiple preferred notes | One answer keeps five questions short and the match denominator understandable. |
| Budget boundaries | Include $100 in both upper bands | Use Under $50, $50–under $100, and $100+ so boundaries are explicit in the labels. |
| Ranking | Weighted or fuzzy scores | Equal preference counts support understandable ranking; tied results remain deterministic without implying stronger suitability. The technical tie-break method belongs in planning; no commercial influence. |
| Minimum suitability | Fill slots with affordable zero-match products | Require one evidenced match; an honest empty state avoids unrelated fillers. |
| Incomplete records | Exclude every incomplete record or invent defaults | Exclude missing required data, retain unknown feeling/occasion tags transparently. |
| Match indicator | Percentage confidence | A preference count communicates evidence without implying scent satisfaction. |
| Measurement scope | Production tracking and cart integration | Moderated validation and future definitions keep scope small and avoid real customer data. |

### Hypothesis, Open Product Questions, and Evidence

The unvalidated hypothesis is that shoppers without fragrance terminology reach relevant products more confidently using familiar preferences. Feeling and occasion tags are editorial fictional catalog attributes, not proof of personal suitability. Equal weights and one-match eligibility are testable defaults.

Preserve these questions: Do users understand why each fragrance was recommended? Can they recover when no exact match exists? Is adjusting one preference easier than restarting? Does the experience reduce decision complexity without pretending certainty?

SC-001–SC-004 and SC-008 collect evidence to assess the hypothesis; record both supportive and contradictory observations rather than declaring success against invented thresholds. Failure to explain recommendations, recover, or understand uncertainty calls for revising copy, tags, matching defaults, or interactions before expanding scope. Record confusion and disagreement with catalog tags even when aggregate observations appear favorable. This small study cannot establish sales uplift or prove personal scent satisfaction.
