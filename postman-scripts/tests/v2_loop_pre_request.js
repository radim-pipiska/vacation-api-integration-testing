const days = JSON.parse(pm.collectionVariables.get("markedDays") || "[]");
if (days.length === 0) {
    throw new Error("markedDays je prázdné nebo chybí – nejdřív spusť H1");
}
const i = Number(pm.collectionVariables.get("dayIndex")) || 0;
pm.collectionVariables.set("currentDay", days[i]);
