
const path = require('path');

module.exports = function(app) {
    //app.post('/login', myfunc)
    //app.get('/name', myfunc)

    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("./../public/dashboardIndex.html"))
    });
}
