# Pre-publish checklist (delete this file before publishing)

## Confidentiality
- [ ] Confirm the API and its specification are OK to publish (employer/client). If unsure: anonymise, keep `{{baseUrl}}`, paraphrase instead of quoting the spec.
- [ ] No cookies, tokens, IPs or raw console logs in the repo (`.gitignore` excludes `Log_*.txt`). Evidence files here are sanitised extracts.
- [ ] Postman export: check collection variables (export contains *initial* values only), no secrets in headers.

## Bug reports (drafts → final)
- [ ] BUG-1: make the 20 Oct 2026 probe (RP309385) the primary reproduction – all 4 steps are verified in `evidence/probe_*`. Steps "GET 2028-08-05 → true" for 18 and 19 Oct are **not** in the logs: remove or mark as not verified.
- [ ] BUG-1: add the fact that the stored day 2028-08-05 is a Saturday (`DayOfWeekCz: "So"`).
- [ ] Weekday-holiday report: "Testováno" line still lists 14–17 Oct; use "Ověřený běh: 19. 10. 2026".
- [ ] Remove counts that no log supports ("3×", "3 pokusy"); cite the verified runs (18 and 19 Oct) and say earlier findings had no logs.
- [ ] Fix sentences: weekend report ("…1 (…) byly vynechány"), weekday report (first sentence has no verb).
- [ ] Titles say "jsou chybně zapisovány" but it is 5 of 6 / 5 of 15 – write "některé".
- [ ] Spec says "české státní svátky". Check in the law which of the tested days are "státní" and which "ostatní svátky" (e.g. 1 May, Good Friday, Easter Monday, 24–26 Dec) – keep `[OVĚŘIT SPEC]` where unclear.

## Repo
- [ ] Add exported Postman collection (README placeholder).
- [ ] Fill README placeholders `[DOPLNIT RUČNĚ]`; pick a licence (e.g. MIT) for the scripts.
- [ ] Rewrite `docs/ai-review-notes.md` in your own words.
