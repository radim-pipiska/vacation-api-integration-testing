> DRAFT – finalise before publishing (see docs/PRE-PUBLISH-CHECKLIST.md)

# Bug Report: Záměna dne a měsíce

**Název:** POST /Vacation: Dochází k prohození dne a měsíce u data 2028-05-08 (zapsáno jako 2028-08-05).  
**Prostředí:** {{baseUrl}} (Ověřený běh: 19. 10. 2026)  
**Závažnost:** Vysoká  
**Dle specifikace:** „Zapíše dovolenou pro zaměstnance. Přeskočí víkendy a české státní svátky.“  
**Očekávaný výsledek:** Kritérium: MarkedDays obsahuje pouze dny z požadovaného intervalu DateFrom–DateTo.<br>Při požadavku na 2028-05-08: Jelikož jde o státní svátek, API vrátí HTTP 200 s MarkedDays = [] a zprávou "Žádné nové dny dovolené (vše již zapsáno nebo jen víkendy/svátky)." V žádném případě nesmí být zapsán den mimo požadovaný interval.  
**Skutečný výsledek:** API vrací HTTP 200, MarkedDays = ["2028-08-05"] a zprávu Zapsáno 1 dní dovolené… Došlo k prohození dne a měsíce.  

### Kroky pro replikaci
### Primární reprodukce (18. 10. 2026)
**1. POST /Vacation** {"PersonId": "RP870937", "DateFrom": "2028-05-08", "DateTo": "2028-05-08"}  
**2. Návratová hodnota API** MarkedDays = ["2028-08-05"]  
**3. Ověřit chybně zapsaný den** GET /VacationCheck?personId=RP870937&date=2028-08-05 -> IsVacation: true  
**4. Ověřit původně požadovaný den** GET /VacationCheck?personId=RP870937&date=2028-05-08 -> IsVacation: false  

### Sekundární reprodukce (19. 10. 2026)
**1. POST /Vacation** {"PersonId": "RP745798", "DateFrom": "2028-05-08", "DateTo": "2028-05-08"}  
**2. Návratová hodnota API** MarkedDays = ["2028-08-05"]  
**3. Ověřit chybně zapsaný den** GET /VacationCheck?personId=RP745798&date=2028-08-05 -> IsVacation: true  
**4. Ověřit původně požadovaný den** GET /VacationCheck?personId=RP745798&date=2028-05-08 -> IsVacation: false  
