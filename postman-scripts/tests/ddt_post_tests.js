const date = pm.iterationData.get("date");
const raw = pm.iterationData.get("expectedMarkedCount");
const bug = pm.iterationData.get("knownBug");
const tag = bug ? "[" + bug + "] " : "";
const person = pm.variables.get("ddtPerson");

pm.test("Vstup: expectedMarkedCount je celé číslo (spouštěj přes Runner)", function () {
    pm.expect(String(raw), "hodnota z CSV: " + JSON.stringify(raw)).to.match(/^\d+$/);
});
const expectedCount = Number(raw);

pm.test("POST: status je 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("POST: zapsané dny odpovídají tabulce", function () {
    const days = pm.response.json().MarkedDays;
    const evidence = " | MarkedDays=" + JSON.stringify(days) + " požadováno=" + date + " osoba=" + person;
    pm.expect(days, tag + "MarkedDays chybí" + evidence).to.be.an("array");
    const expected = expectedCount === 1 ? [date] : [];
    pm.expect(days, tag + "zapsané dny" + evidence).to.eql(expected);
});
