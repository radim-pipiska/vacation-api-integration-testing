> DRAFT – finalise before publishing (see docs/PRE-PUBLISH-CHECKLIST.md)

# Bug Report: Státní svátky ve všední den

**Název:** POST /Vacation: Státní a ostatní svátky připadající na všední dny, jsou chybně zapisovány jako dovolená.  
**Prostředí:** {{baseUrl}} (Testováno: 14. , 15. , 16. a 17. 10. 2026)  
**Závažnost:** Střední  
**Dle specifikace:** „Zapíše dovolenou pro zaměstnance. Přeskočí víkendy a české státní svátky.“  
**Popis chyby:** Státní svátek připadne na všední den (pondělí až pátek). Z testovaných svátků bylo 9 vynecháno, 5 zapsáno a 1 zapsáno na jiné datum. Hlavní zjištění: 5. 7. se v roce 2027 vynechá, v roce 2028 ne (reprodukováno 3× v 2028 a 2× v 2027).  
**Očekávaný výsledek:** HTTP 200, MarkedDays = [], zpráva "Žádné nové dny dovolené (vše již zapsáno nebo jen víkendy/svátky)."  
**Skutečný výsledek:** HTTP 200, MarkedDays = ["YYYY-MM-DD"], zpráva Zapsáno 1 dní dovolené… GET /VacationCheck vrací IsVacation: true.  

### Přehled testovaných případů (Duplicita)
| Datum | Název svátku | Den v týdnu | PersonId | Skutečný výsledek (MarkedDays) | Stav v GET /VacationCheck |
|---|---|---|---|---|---|
| 2028-07-05 | Cyril a Metoděj | Středa | RP745798 | ["2028-07-05"] | IsVacation: true |
| 2027-03-26 | Velký pátek | Pátek | RP745798 | ["2027-03-26"] | IsVacation: true |
| 2028-04-17 | Velikonoční pondělí | Pondělí | RP745798 | ["2028-04-17"] | IsVacation: true |
| 2028-07-06 | Den upálení mistra Jana Husa | Čtvrtek | RP745798 | ["2028-07-06"] | IsVacation: true |
| 2028-11-17 | Den boje za svobodu a demokracii | Pátek | RP745798 | ["2028-11-17"] | IsVacation: true |

**Vynecháno / Správné chování pro porovnání:** 2027-07-05 (Pondělí, Cyril a Metoděj): Správně vynecháno (MarkedDays = [])  
**Další dny, kdy bylo správně vynecháno:** 2026-10-28, 2026-12-24, 2027-12-24, 2027-07-06, 2027-09-28, 2027-11-17, 2028-05-01, 2028-09-28.  

### Kroky pro replikaci (Příklad pro 2028-07-05)
**1. Odeslat POST /Vacation** {"PersonId": "RP745798", "DateFrom": "2028-07-05", "DateTo": "2028-07-05"}  
**2. Očekávaný výsledek** HTTP 200, MarkedDays = [], zpráva "Žádné nové dny dovolené (vše již zapsáno nebo jen víkendy/svátky)."  
**3. Skutečný výsledek** HTTP 200, MarkedDays = ["2028-07-05"], zpráva Zapsáno 1 dní dovolené…  
**4. Ověřit stav přes GET** GET /VacationCheck?personId=RP745798&date=2028-07-05 -> vrací IsVacation: true  
