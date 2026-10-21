// const mockToday = "2026-10-17";

pm.collectionVariables.set("personId", "RP" + String(Date.now()).slice(-6));

let today;
if (typeof mockToday !== 'undefined' && mockToday) {
    today = new Date(mockToday + "T00:00:00Z");
} else {
    const now = new Date();
    today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// --- VALIDACE ROZSAHU KALENDÁŘE (2026 - 2028) ---
function validateYearRange(date, contextName) {
    const year = date.getUTCFullYear();
    if (year < 2026 || year > 2028) {
        throw new Error(`[QA ERROR] Datum pro '${contextName}' (${year}) je mimo povolený rozsah kalendáře 2026-2028!`);
    }
}
validateYearRange(today, "Dnešní datum (today)");

// --- DEFINICE ČESKÝCH STÁTNÍCH SVÁTKŮ ---
function getCzechHolidayName(date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    
    if (month === 1 && day === 1) return "Den obnovy samostatného českého státu a Nový rok";
    if (month === 5 && day === 1) return "Svátek práce";
    if (month === 5 && day === 8) return "Den vítězství";
    if (month === 7 && day === 5) return "Den slovanských věrozvěstů Cyrila a Metoděje";
    if (month === 7 && day === 6) return "Den upálení mistra Jana Husa";
    if (month === 9 && day === 28) return "Den české státnosti (svátek sv. Václava)";
    if (month === 10 && day === 28) return "Den vzniku samostatného československého státu";
    if (month === 11 && day === 17) return "Den boje za svobodu a demokracii";
    if (month === 12 && day === 24) return "Štědrý den";
    if (month === 12 && day === 25) return "1. svátek vánoční";
    if (month === 12 && day === 26) return "2. svátek vánoční";

    if (year === 2026) {
        if (month === 4 && day === 3) return "Velký pátek";
        if (month === 4 && day === 6) return "Velikonoční pondělí";
    }
    if (year === 2027) {
        if (month === 3 && day === 26) return "Velký pátek";
        if (month === 3 && day === 29) return "Velikonoční pondělí";
    }
    if (year === 2028) {
        if (month === 4 && day === 14) return "Velký pátek";
        if (month === 4 && day === 17) return "Velikonoční pondělí";
    }
    return null;
}

function addDays(date, days) {
    const result = new Date(date.getTime());
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function getMondayOfWeeksISO(date) {
    const result = new Date(date.getTime());
    const day = result.getUTCDay();
    const dayDiff = day === 0 ? -6 : 1 - day;
    result.setUTCDate(result.getUTCDate() + dayDiff);
    return result;
}

function formatDate(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

// --- KONTROLA POVOLENÉHO TÝDNE (Svátek v pracovní den vyřazuje týden) ---
const loggedWeeks = new Set();

function isWeekAllowed(date) {
    const monday = getMondayOfWeeksISO(date);
    const mondayStr = formatDate(monday);
    
    // Prohledáváme pouze pracovní dny Po-Pá (index 1 až 5)
    for (let i = 0; i < 5; i++) {
        const currentWorkingDay = addDays(monday, i);
        const holidayName = getCzechHolidayName(currentWorkingDay);
        
        if (holidayName) {
            if (!loggedWeeks.has(mondayStr)) {
                const sundayStr = formatDate(addDays(monday, 6));
                console.warn(`[Skip Week] Týden ${mondayStr} až ${sundayStr} BYL VYNECHÁN. Svátek v prac. den: ${formatDate(currentWorkingDay)} (${holidayName}).`);
                loggedWeeks.add(mondayStr);
            }
            return false;
        }
    }
    return true;
}

function isBusinessDay(date) {
    const day = date.getUTCDay();
    return day !== 0 && day !== 6;
}

// --- VÝPOČET TERMÍNU DOVOLENÉ ---
let dateFromObj = null;
let dateToObj = null;

// Hledáme ucelený blok 5 po sobě jdoucích pracovních dnů v povolených týdnech
let currentCheckDate = addDays(today, 1);

while (dateFromObj === null) {
    if (isWeekAllowed(currentCheckDate) && isBusinessDay(currentCheckDate)) {
        let candidateFrom = new Date(currentCheckDate.getTime());
        let candidateTo = new Date(currentCheckDate.getTime());
        let daysFound = 1;
        let isValidSequence = true;

        while (daysFound < 5) {
            candidateTo = addDays(candidateTo, 1);
            if (isBusinessDay(candidateTo)) {
                if (isWeekAllowed(candidateTo)) {
                    daysFound++;
                } else {
                    isValidSequence = false;
                    break;
                }
            }
        }

        if (isValidSequence && daysFound === 5) {
            dateFromObj = candidateFrom;
            dateToObj = candidateTo;
        } else {
            currentCheckDate = addDays(getMondayOfWeeksISO(candidateTo), 7);
        }
    } else {
        if (!isWeekAllowed(currentCheckDate)) {
            currentCheckDate = addDays(getMondayOfWeeksISO(currentCheckDate), 7);
        } else {
            currentCheckDate = addDays(currentCheckDate, 1);
        }
    }
}

validateYearRange(dateFromObj, "Vypočtené dateFrom");
validateYearRange(dateToObj, "Vypočtené dateTo");

const dateFromStr = formatDate(dateFromObj);
const dateToStr = formatDate(dateToObj);

// --- VERIFIKACE INVARIANTŮ (Tvrdé QA testování před uložením) ---
let totalWorkingDays = 0;
let checkDate = new Date(dateFromObj.getTime());
while (checkDate.getTime() <= dateToObj.getTime()) {
    if (isBusinessDay(checkDate)) {
        totalWorkingDays++;
    }
    if (!isWeekAllowed(checkDate)) {
        throw new Error(`[QA CRITICAL ERROR] Vygenerovaný interval obsahuje den v zakázaném týdnu: ${formatDate(checkDate)}!`);
    }
    checkDate = addDays(checkDate, 1);
}

if (totalWorkingDays !== 5) {
    throw new Error(`[QA CRITICAL ERROR] Vygenerovaný rozsah neodpovídá přesně 5 pracovním dnům! Skutečnost: ${totalWorkingDays} dnů (${dateFromStr} -> ${dateToStr}).`);
}

// --- LOGOVÁNÍ HRANIČNÍCH PŘÍPADŮ DO KONZOLE ---
console.log(`[QA Info] Vstupní testovací datum (dnes): ${formatDate(today)}`);
console.log(`[QA Info] Výsledek úspěšně ověřen -> dateFrom: ${dateFromStr} | dateTo: ${dateToStr}`);

let containsLeapDay = false;
let leapCheck = new Date(dateFromObj.getTime());
while (leapCheck.getTime() <= dateToObj.getTime()) {
    if (leapCheck.getUTCFullYear() === 2028 && leapCheck.getUTCMonth() === 1 && leapCheck.getUTCDate() === 29) {
        containsLeapDay = true;
        break;
    }
    leapCheck = addDays(leapCheck, 1);
}
if (containsLeapDay) {
    console.warn(`[Edge Case] Vygenerovaná data přímo obsahují přestupný den 29. února 2028.`);
}

if (dateFromObj.getUTCMonth() !== dateToObj.getUTCMonth()) {
    console.warn(`[Edge Case] Detekován PŘELOM MĚSÍCE uvnitř vygenerovaného rozsahu.`);
}

// --- ULOŽENÍ DO LOKÁLNÍCH PROMĚNNÝCH POSTMANA ---
pm.variables.set("dateFrom", dateFromStr);
pm.variables.set("dateTo", dateToStr);
