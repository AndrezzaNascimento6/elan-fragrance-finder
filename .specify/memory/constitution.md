# Élan Fragrance Finder Constitution

## Core Principles

### I. Product Clarity Before Implementation

Every feature MUST document a clear user problem, business objective, expected behavior, and
measurable success criteria before implementation begins. Its contribution to the core goal
of helping users discover suitable fragrances through understandable, preference-based
recommendations MUST be explicit. Features without that contribution MUST be excluded from
scope. Success criteria MUST identify an observable outcome, target, and verification method.

### II. Explainable Recommendations

Every recommendation MUST explain which user preferences and structured product attributes
influenced its inclusion and ranking. Explanations MUST be traceable to the actual rules and
data used. AI output MUST be presented as decision support and MUST NOT claim unquestionable
authority or unsupported certainty. Relevant uncertainty, incomplete matches, and trade-offs
MUST be visible in clear language so users can judge suitability for themselves.

### III. User Control

Users MUST be able to revisit previous answers and change preferences without restarting the
entire experience. The interface MUST show active preferences and explain how changes affect
recommendations, including when results remain unchanged. Dark patterns, unnecessary friction,
and manipulative persuasion MUST NOT be used. Preference changes MUST remain deliberate and
reversible.

### IV. Accessibility by Default

All interactive elements MUST be keyboard accessible and have visible focus states and
meaningful accessible labels. The interface MUST use semantic HTML, sufficient text and control
contrast, and clear error messages identifying the problem and recovery action. Information
MUST NOT depend on color alone. Accessibility verification MUST be part of the definition of
done for every affected flow, including preference editing and result updates, rather than a
later enhancement.

### V. Data Integrity

Recommendations MUST use only the structured product dataset and explicit ranking rules.
Product attributes, prices, availability, and recommendation evidence MUST NOT be invented at
runtime. AI-generated wording, if used, MUST remain grounded in those inputs and MUST NOT
introduce unsupported facts or alter ranking decisions. Missing or incomplete data MUST be
identified transparently. Unknown values MUST NOT be silently treated as known matches. Rules
for excluding, retaining, or ranking incomplete records MUST be documented and verifiable.

### VI. Maintainable Implementation

Implementation MUST use the simplest readable architecture that satisfies documented needs.
Business logic, including preference interpretation and ranking, MUST be separated from
presentation logic and independently verifiable. Components MUST be reused where this improves
consistency or removes meaningful duplication. Abstractions, dependencies, and architectural
layers MUST have a concrete current justification; speculative extensibility MUST NOT drive
complexity.

### VII. Testable Behavior

Acceptance criteria MUST describe observable product behavior rather than implementation
details. Important recommendation rules, edge cases, ties, missing data, no-match results,
empty states, and error states MUST have reproducible verification. Ranking rules and their
edge cases MUST have automated tests. Interaction and accessibility checks MUST include
recorded verification appropriate to the changed flow. Verification MUST demonstrate that
explanations agree with the preferences, data, and rules that produced the results.

### VIII. Performance and Responsiveness

The experience MUST provide immediate interaction feedback and responsive recommendations for
the supported small catalog. Changes affecting response time MUST define a measurable latency
target, representative catalog size, and device conditions before implementation and verify
them before completion. Core flows MUST work on desktop and mobile without loss of content or
controls. Visual effects MUST NOT obscure information, delay interaction, or reduce
responsiveness. Motion MUST respect reduced-motion preferences.

### IX. Senior Product Decision-Making

Important decisions MUST document alternatives, trade-offs, the selected option, and its
rationale. Decision records MUST distinguish user needs, business goals, technical constraints,
and unvalidated hypotheses. When uncertainty exists, the team MUST choose the smallest
implementation capable of validating the product assumption and define what evidence would
support, reject, or revise it. Scope MUST be reconsidered when evidence contradicts the
assumption.

## Product and Recommendation Constraints

The structured catalog and documented ranking rules are the source of truth for recommendation
decisions. Specifications MUST identify required product fields, explicit preference inputs,
ranking and tie-breaking behavior, and treatment of missing data. Catalog limitations MUST be
reflected in the experience rather than filled with generated claims.

Recommendation presentation MUST connect results to supporting evidence and disclose material
mismatches. Any business-driven ranking influence MUST be explicit in the rules and visible to
users when it affects their results. Product language MUST support informed choice and MUST NOT
imply that a recommendation guarantees personal satisfaction.

## Delivery and Review Gates

Before implementation, the feature specification MUST state the problem, objective, core-goal
alignment, expected behavior, measurable success criteria, and observable acceptance scenarios.
The plan MUST identify data dependencies, ranking changes, accessibility considerations,
applicable performance targets, and important trade-offs or hypotheses.

Before marking work done, review MUST verify applicable principles and retain evidence of:

- Recommendation correctness and agreement between ranking evidence and explanations.
- Preference editing, revisiting answers, and understandable result updates.
- Keyboard operation, focus visibility, labels, contrast, and error recovery.
- Important rules, edge cases, empty states, and error states.
- Desktop and mobile usability and applicable performance targets.

Checks MUST be proportional to the change. Inapplicable checks MUST have a recorded rationale.
Unresolved violations MUST block completion until corrected or addressed by an explicit
constitutional amendment; they MUST NOT be silently deferred.

## Governance

This constitution governs project specifications, plans, tasks, implementation, and reviews.
Every feature review MUST check compliance before implementation and before completion.
Conflicts in project guidance MUST be resolved in favor of this constitution and recorded for
correction.

Amendments MUST include a written proposal, rationale, affected principles, impact on existing
work, and required migration or follow-up actions. The project maintainer MUST approve the
amendment before adoption. Adoption MUST update the constitution version and last-amended date
while preserving the original ratification date.

Versions follow semantic versioning: MAJOR for incompatible removals or redefinitions of
principles or governance; MINOR for new principles, sections, or materially expanded guidance;
PATCH for clarifications or corrections that do not change obligations. Amendment review MUST
identify dependent artifacts requiring follow-up; this workflow changes only the constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-19 | **Last Amended**: 2026-10-19
