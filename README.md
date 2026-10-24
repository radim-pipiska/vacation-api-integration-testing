# Vacation API – integration test suite (Postman + Chai)

Test suite and investigation of a REST API for recording employee vacation
(`POST /Vacation`, `GET /VacationCheck`). Built as part of my retraining from
Senior QA Tester to Integration Test Engineer, with a focus on
**AI-assisted test scripting and critical review of AI output**.


## Highlights

- **Data-driven regression table** (`data/regression_table.csv`, 31 dates) → 217 tests per run,
  **21 expected failures = 3 known defect classes**, each tagged `[BUG-n]` in the assertion message.
  A red test without a tag means a regression or a test bug.
- **Expectations come from the specification, not from observed output.**
  Known bugs stay red instead of being "fixed" in the test.
- **Dynamic test data** generated in a pre-request script (next 5 working days, skipping holiday weeks).
- **Request chaining + loop**: `POST /Vacation` → `GET /VacationCheck` for every returned day.
- **Independent oracle** for the chain (expected days computed from the request inputs, UTC)
  and a **sabotage check** proving the assertion can fail.
- **Evidence** exported from real runs (`evidence/`), cross-checked by script against the regression table.

## Findings (see `bug-reports/`, drafts)

| ID | Summary | Evidence |
|----|---------|----------|
| BUG-1 | `2028-05-08` is stored as `2028-08-05` (day and month swapped); the stored day is a Saturday | `evidence/probe_2028-05-08_2026-10-20.md` |
| BUG-2 | Holidays falling on a weekend are written as vacation (5 of 6 tested) | `evidence/regression_run_2026-10-19.csv` |
| BUG-3 | Holidays on weekdays are written as vacation (5 of 15 tested); e.g. 5 July is skipped in 2027 but written in 2028 | same |

## How to run

1. Import the Postman collection `postman/Vacation API - testovací sada.postman_collection` and set the collection variable `baseUrl`.
2. Regression: Runner → folder *Data-Driven Testing* → data file `data/regression_table.csv` → 31 iterations.
   Expected: 217 tests, 21 failed (all tagged `[BUG-n]`).
3. Chain/loop: Runner → folder *Smyčka H1 → V2* → **1 iteration, no data file**
   (the loop works only in the Runner, not with a single *Send*).

## Layout

```
postman-scripts/pre-request/   data generation (dynamic dates, per-run person id)
postman-scripts/tests/         Chai assertions (DDT, chain with oracle, loop)
data/                          regression table (spec-based expectations)
evidence/                      sanitised results of real runs
bug-reports/                   report drafts
docs/                          AI review notes, pre-publish checklist
```

## AI-assisted workflow

I used AI to draft scripts and reports, then reviewed every result. The mistakes AI (and I) made,
and how they were caught, are in [`docs/ai-review-notes.md`](docs/ai-review-notes.md).

---

**CZ shrnutí:** Postman/Chai sada pro API evidence dovolené – DDT regresní tabulka (217 testů, 21 očekávaných
červených = 3 známé vady), dynamická data v pre-requestu, chaining se smyčkou, nezávislý oracle a sabotážní
kontrola, důkazy z reálných běhů. Zaměřeno na kritickou kontrolu výstupů AI.
