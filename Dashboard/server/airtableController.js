const Airtable = require('airtable')
const cred = require('./config/config')

let base = new Airtable({apiKey: cred.API_KEY}).base(cred.BASE_ID);

module.exports = {
    getUserRes : function(req, res) {
        base('User Research').select().firstPage((error, records) => {
            res.json({data: records})
        })
    }
}