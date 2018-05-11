
const path = require('path');
const db = require('../DatabaseController');
const ml = require('../MLController');
const cred = require('../config/config');

module.exports = function(app) {
    //app.post('/login', myfunc)
    //app.get('/name', myfunc
    app.get('/atb', (req, res) => { res.redirect(cred.ATB_LINK) });
    app.get('/fam', (req, res) => { res.redirect(cred.FAM_LINK) });
    app.get('/pbi', (req, res) => { res.redirect(cred.PBI_LINK) });
    app.get('/marketing', db.getAdData);
    app.post('/predict', ml.predict);
    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("./../public/dashboardIndex.html"))
    });
}
