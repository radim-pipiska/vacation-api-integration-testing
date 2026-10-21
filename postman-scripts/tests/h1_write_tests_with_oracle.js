pm.collectionVariables.set('dayIndex', '0');
pm.collectionVariables.unset('firstDay');
pm.collectionVariables.unset('markedDays');

// Nezávislé očekávání: pracovní dny (Po–Pá) od dateFrom do dateTo, počítáno v UTC
function expectedBusinessDays(fromStr, toStr) {
    const result = [];
    const d = new Date(fromStr + "T00:00:00Z");
    const end = new Date(toStr + "T00:00:00Z");
    while (d.getTime() <= end.getTime()) {
        const wd = d.getUTCDay();
        if (wd !== 0 && wd !== 6) {
            result.push(d.toISOString().slice(0, 10));
        }
        d.setUTCDate(d.getUTCDate() + 1);
    }
    return result;
}

pm.test('H1: zápis vrátil 200 a seznam dní', function () {
    pm.response.to.have.status(200);
    const days = pm.response.json().MarkedDays;
    pm.expect(days, 'MarkedDays chybí nebo je prázdné').to.be.an('array').that.is.not.empty;
    pm.collectionVariables.set('firstDay', days[0]);
    pm.collectionVariables.set('markedDays', JSON.stringify(days));
});

pm.test('H1: MarkedDays odpovídají nezávisle spočtenému očekávání', function () {
    const dateFrom = pm.variables.get('dateFrom');
    const dateTo = pm.variables.get('dateTo');
    pm.expect(dateFrom, 'dateFrom chybí (neběžel pre-request?)').to.match(/^\d{4}-\d{2}-\d{2}$/);
    pm.expect(dateTo, 'dateTo chybí (neběžel pre-request?)').to.match(/^\d{4}-\d{2}-\d{2}$/);
    const expected = expectedBusinessDays(dateFrom, dateTo);
    const days = pm.response.json().MarkedDays;
    pm.expect(days, 'MarkedDays=' + JSON.stringify(days) + ' očekáváno=' + JSON.stringify(expected)).to.eql(expected);
});
