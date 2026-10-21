> DRAFT – finalise before publishing (see docs/PRE-PUBLISH-CHECKLIST.md)

# Bug Report: Státní svátky o víkendu

**Název:** POST /Vacation: Státní a ostatní svátky připadající na sobotu/neděli, jsou chybně zapisovány jako dovolená.  
**Prostředí:** {{baseUrl}} (Ověřený běh: 19. 10. 2026)  
**Závažnost:** Střední  
**Dle specifikace:** „Zapíše dovolenou pro zaměstnance. Přeskočí víkendy a české státní svátky.“  
**Popis chyby:** Státní svátek o víkendovém dnu (sobota/neděle): z 6 testovaných svátků o víkendu bylo 5 zapsáno a 1 (2027-05-08, 3 pokusy) byly vynechány.  
**Očekávaný výsledek:** HTTP 200, MarkedDays = [], zpráva "Žádné nové dny dovolené (vše již zapsáno nebo jen víkendy/svátky)."  
**Skutečný výsledek:** HTTP 200, MarkedDays = ["YYYY-MM-DD"], zpráva Zapsáno 1 dní dovolené… GET /VacationCheck vrací IsVacation: true.  

### Přehled testovaných případů (Duplicita)
| Datum | Název svátku | Den v týdnu | PersonId | Skutečný výsledek (MarkedDays) | Stav v GET /VacationCheck |
|---|---|---|---|---|---|
| 2026-12-26 | 2. svátek vánoční | Sobota | RP745798 | ["2026-12-26"] | IsVacation: true |
| 2027-05-01 | Svátek práce | Sobota | RP745798 | ["2027-05-01"] | IsVacation: true |
| 2027-12-25 | 1. svátek vánoční | Sobota | RP745798 | ["2027-12-25"] | IsVacation: true |
| 2027-12-26 | 2. svátek vánoční | Neděle | RP745798 | ["2027-12-26"] | IsVacation: true |
| 2028-10-28 | Den vzniku ČSR | Sobota | RP745798 | ["2028-10-28"] | IsVacation: true |

**Vynecháno / Správné chování pro porovnání:** 2027-05-08 (Sobota, Den vítězství): Správně vynecháno (MarkedDays = [])  
### 2026-10-17, 2027-05-15 (Sobota, není svátek): Správně vynecháno (MarkedDays = [])

### Kroky pro replikaci (Příklad pro 2027-05-01)
**1. Odeslat POST /Vacation** {"PersonId": "RP745798", "DateFrom": "2027-05-01", "DateTo": "2027-05-01"}  
**2. Očekávaný výsledek** HTTP 200, MarkedDays = [], zpráva "Žádné nové dny dovolené (vše již zapsáno nebo jen víkendy/svátky)."  
**3. Skutečný výsledek** HTTP 200, MarkedDays = ["2027-05-01"], zpráva Zapsáno 1 dní dovolené…  
**4. Ověřit stav přes GET** GET /VacationCheck?personId=RP745798&date=2027-05-01 -> vrací IsVacation: true  
