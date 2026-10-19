# Recommendation Function Contract

`recommend(catalog, preferences)` is a pure TypeScript function accepting a normalized usable catalog and complete canonical preferences; invalid preferences return a typed validation failure. It returns a discriminated success/empty result plus diagnostics. Loading failures belong to the loader boundary. No React imports, mutations, random values, current time, network or locale-sensitive comparisons.

1. Filter invalid products and duplicate conflicts as defined in [catalog.md](catalog.md).
2. Filter by integer cents: `under-50`: 0 ≤ price < 5000; `50-under-100`: 5000 ≤ price < 10000; `100-plus`: price ≥ 10000. Never expand the band.
3. Compare feeling tag membership, occasion tag membership, selected category on at least one explicitly associated named key note, and exact intensity equality. Each supported dimension contributes one point regardless of repeated matching tags/notes. Unknown contributes zero, distinguished from known mismatch.
4. Exclude score zero. Sort descending score then ascending stable ASCII product ID using code-unit comparison (`<`/`>`), with no localeCompare or source-order fallback. IDs are unique ASCII slugs. Price, visual prominence, unknown counts and editorial preference are never secondary weights.
5. Take first three distinct identities. Produce score and evidence from the same comparisons. Budget is a separate eligibility statement, never a fifth point.

Equal-score order is an identity-based presentation rule, not evidence of stronger suitability. Show that tied products match the same number of preferences; do not claim rank superiority within ties. Return match count as a count, never satisfaction probability.

Evidence copy must enumerate all four dimensions (concise summary plus visible supporting detail is acceptable), including selected values and actual known alternatives or unspecified evidence. A 3/4 example for Fresh/Everyday/Citrus/Light describes Fresh, Everyday and a named Citrus note as matches, Balanced intensity as the difference, and budget compliance separately. A missing feeling tag says feeling unspecified, never “not Fresh.”

`compareRuns(previousSuccessfulRun, currentRun)` reports changes in IDs, order and evidence from their stored snapshots. Name the last applied preference and explain visible effects; if ordering and membership are unchanged, say so and still report changed match evidence. If no prior successful run exists, describe the applied preference and current result without claiming a previous ranking. Exact restoration with unchanged catalog restores original order and evidence.

Automated invariants: permutation of source rows cannot change output; identical input yields identical output; no mutation; budget always holds; score equals matched evidence count; every positive claim resolves to input evidence; 0–3 unique IDs; unknown fields never match; same answer creates no change claim.
