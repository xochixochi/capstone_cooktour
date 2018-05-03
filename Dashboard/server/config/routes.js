
const path = require('path');
const db = require('../airtableController');


module.exports = function(app) {
    //app.post('/login', myfunc)
    //app.get('/name', myfunc)
    app.get('/marketing', db.getUserRes);
    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("./../public/dashboardIndex.html"))
    });
}
