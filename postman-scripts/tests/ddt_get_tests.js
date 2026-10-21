const date = pm.iterationData.get("date");
const raw = pm.iterationData.get("expectedIsVacation");
const bug = pm.iterationData.get("knownBug");
const tag = bug ? "[" + bug + "] " : "";
const normalized = String(raw).trim().toLowerCase();
const person = pm.variables.get("ddtPerson");

pm.test("Vstup: expectedIsVacation v CSV je true/false", function () {
    pm.expect(["true", "false"], "neplatná hodnota v CSV: " + JSON.stringify(raw)).to.include(normalized);
});
const expectedIsVacation = normalized === "true";

pm.test("GET: status je 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("GET: datum v odpovědi odpovídá řádku tabulky", function () {
    const body = pm.response.json();
    const evidence = " | Date=" + body.Date + " požadováno=" + date + " osoba=" + person;
    pm.expect(body.Date, "odpověď neobsahuje Date" + evidence).to.be.a("string");
    pm.expect(body.Date, "datum" + evidence).to.equal(date);
});

pm.test("GET: IsVacation odpovídá tabulce", function () {
    const body = pm.response.json();
    const evidence = " | IsVacation=" + body.IsVacation + " požadováno=" + date + " osoba=" + person;
    pm.expect(body.IsVacation, tag + "IsVacation chybí v odpovědi" + evidence).to.be.a("boolean");
    pm.expect(body.IsVacation, tag + "IsVacation" + evidence).to.equal(expectedIsVacation);
});
