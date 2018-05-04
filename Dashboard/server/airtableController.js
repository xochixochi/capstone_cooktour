const Airtable = require('airtable')
const cred = require('./config/config')

let base = new Airtable({apiKey: cred.API_KEY}).base(cred.BASE_ID);

module.exports = {
    getAdData : function(req, res) {
        let ccat = [];
        base('Capstone Ad Data (April 25)').select({"fields" : ["Content Category"]}).eachPage(
            (records, getNextPage) => {
                ccat = ccat.concat(records);
                getNextPage();
            },
            (error) => {
                ccatFinal = []
                ccat.forEach((record) => {
                    let category = record.fields["Content Category"]
                    if (!ccatFinal.includes(category) && category) {
                        ccatFinal.push(category);
                    }
                })
                res.json({'data': ccatFinal});
            }
        )
    },

    getFormCat : function(req, res) {
        base('User Research').select({}).firstPage((error, records) => {
            res.json({data: records})
        })
    }
}