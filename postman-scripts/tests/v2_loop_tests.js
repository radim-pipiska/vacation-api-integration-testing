const days = JSON.parse(pm.collectionVariables.get("markedDays") || "[]");
const i = Number(pm.collectionVariables.get("dayIndex")) || 0;
const day = pm.collectionVariables.get("currentDay");

pm.test("V2: status je 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("V2: den z MarkedDays je zapsaný (IsVacation true)", function () {
    const body = pm.response.json();
    pm.expect(body.Date, "odpověď neobsahuje Date").to.be.a("string");
    pm.expect(body.Date).to.equal(day);
    pm.expect(body.IsVacation, "den " + day + " (index " + i + ")").to.be.true;
});

if (i + 1 < days.length) {
    pm.collectionVariables.set("dayIndex", String(i + 1));
    pm.execution.setNextRequest(pm.info.requestName);
} else {
    pm.collectionVariables.unset("dayIndex");
}
