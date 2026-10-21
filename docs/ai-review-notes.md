# AI review notes

Real incidents from this project: what went wrong, how it was caught, the rule I took from it.

| # | What happened | How it was caught | Rule |
|---|---------------|-------------------|------|
| 1 | Pasted code *fragments* (`// ...`) → a stray top-level `pm.expect(days, ...)` → `ReferenceError`, Runner showed "No tests found" and 31 Errors | Runner summary (Errors ≠ Failed) + console | Ask for complete files, not snippets. A script error is not a failed test, and it can stop the iteration. |
| 2 | AI claim "CSV values are always strings" was wrong – Postman types numbers/booleans. `=== "true"` made true rows false (5 false failures) | `console.log` of the iteration data | Verify assumptions in a log; normalise input and add a guard test that fails loudly. |
| 3 | Vague instruction "add `evidence` analogously" → `evidence is not defined` in all 31 GET tests: 42 red = 11 real + 31 test errors | Failures had no `[BUG-n]` tag and said `ReferenceError` | Triage red tests: tag = known defect, ReferenceError/TypeError = test bug, Errors = request/environment. |
| 4 | Chain V2 reads its days from the API response, so it stays green when the API writes the wrong day | Predicting the result of `2028-05-08 → ["2028-08-05"]`, then a manual probe | Expectations must be independent of the response: compute them from the request inputs (oracle). |
| 5 | The oracle assertion had to be proven able to fail: sabotage line `expected.pop()` – first placed outside the test function → `ReferenceError`, the test never registered | Runner showed "All tests 1", Errors 1 | A test that never registers cannot fail. Check test counts, and re-run after removing the sabotage. |
| 6 | AI-written bug reports contained invented/paraphrased messages and mixed persons/dates | Cross-check against raw console logs (script) | Verbatim quotes only; evidence table; unknown values as `[DOPLNIT RUČNĚ]` / `[OVĚŘIT]`. |
| 7 | My mentor misread a screenshot ("dni" vs "dní"); the raw log said "dní" | Raw log export | Verify against raw data, not against pictures – including claims from AI. |
| 8 | Postman's built-in "fix" suggestions can hide a symptom | Accepted only when two independent signals agreed (`Invalid protocol: get https:` + console showing `GET get https://…` → stray `GET ` in the URL field) | Accept a fix only if the root cause is confirmed. |
| 9 | Spec quote was edited to fit my interpretation | Compared reports against each other | Quote the specification verbatim; keep interpretation separate and marked `[OVĚŘIT SPEC]`. |
