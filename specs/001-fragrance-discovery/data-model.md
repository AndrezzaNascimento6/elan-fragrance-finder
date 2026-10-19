# Data Model

## Shared vocabulary

`data/taxonomy.json` is a versioned build input imported by TypeScript and read by Python. Canonical values: feeling `fresh|warm|elegant|bold`; occasion `everyday|work|date-night|special-occasions`; category `citrus|floral|woody|sweet|spicy`; intensity `light|balanced|intense`; budget `under-50|50-under-100|100-plus`. Labels exactly follow FR-002. No gender attributes or inferred synonyms.

## Fragrance

| Field | JSON type | Rule |
| --- | --- | --- |
| id | string | Required stable lowercase ASCII slug, unique logical identity; immutable for tie ordering. |
| name | string | Required nonblank display name. |
| priceCents | integer | Required nonnegative safe integer USD amount. |
| currency | `USD` | Any other currency excludes the record. |
| imageSrc | string | Required local `/images/fragrances/…` reference. |
| imageAlt | string | Required meaningful fictional product description. |
| keyNotes | array of `{name, categories}` | At least one named note; each has one or more explicit valid categories. No category inferred from note name. |
| intensity | enum | Required valid intensity. |
| feelingTags | array or null | Null means unspecified; empty array means known with no supported feeling tags. |
| occasionTags | array or null | Same unknown/known distinction. |
| productPath | string | Required `#/products/<id>` matching the product identity. |

Nonempty unknown tags, malformed arrays, invalid categories or intensity invalidate a record rather than silently repairing its meaning. Missing feeling/occasion fields normalize to null and remain eligible when other conditions pass. Exclusions, retained unknowns and duplicate resolution are summarized as catalog diagnostics. An image reference missing from CSV excludes a product; a later network/decode image failure preserves the record and shows the unavailable-image fallback.

## CatalogDocument

`schemaVersion: 1`, `products: Fragrance[]`, `diagnostics: {sourceRows, excludedRows, identicalDuplicateRows, unknownAttributeProducts, issues[]}`. Issues identify row, identity when known, field and stable reason code, without user data. No wall-clock generation timestamp; sorted deterministic output permits byte comparisons. A valid zero-row catalog is empty, not corrupt. A nonempty source with no usable identities is unusable and produces a recoverable runtime error. Diagnostics must allow the loader to preserve that distinction.

## PreferenceSet and edit

PreferenceSet contains exactly one canonical feeling, occasion, category, intensity and budget. Questionnaire answers may be incomplete; ranking accepts only a validated complete set. PendingEdit stores question, original answer and draft answer separately from active preferences. Cancel discards draft. Apply commits exactly one field. Reapplying the same answer is a no-op and must not fabricate a change event.

## Recommendation and evidence

Recommendation references one fragrance and contains score 1–4, rank, budget compliance and four evidence entries in question order. Each entry has dimension, selected value, status `matched|mismatched|unknown` and catalog evidence (tag, named notes/categories or actual intensity). Only feeling/occasion can be unknown in an eligible record. Mismatches list known actual values, including an explicitly empty tag set. Unknowns say unspecified. Exact means score 4; partial means score 1–3. Every explanation derives from the same evidence object used for score calculation.

## RecommendationRun and PreferenceChange

Run stores monotonically increasing requestId, applied preferences snapshot, catalog revision and terminal result. Result is `success` (1–3 recommendations), `empty`, or `error`; diagnostics accompany usable results. PreferenceChange compares previous successful snapshot with new applied snapshot: changed field/from/to, added/removed IDs, old/new order and changed evidence per retained ID. If several edits occurred during failure, also distinguish the last applied field from the full difference to the last successful snapshot. Never compare a pending draft as if applied.

## Visit transitions

`intro → questions[0..4] → processing → results|empty|error`. Back preserves answers. Results/empty/error allow editing; applying returns to processing; retry uses the latest applied snapshot. Details are a navigation subview preserving the underlying finder state, successful run and editor context. Invalid detail IDs show a recoverable not-found view with a return action. Browser Back/Forward updates the subview without dropping visit state. Full reload starts a new visit; no cross-visit persistence is required.

Only the current requestId may commit a terminal result. Editing during a pending request invalidates it; retry allocates a new ID. Hide previous recommendations during processing/error to avoid stale-current ambiguity while retaining their snapshot internally for honest change summaries.
