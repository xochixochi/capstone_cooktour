const Airtable = require('airtable')
const cred = require('./config/config')

let base = new Airtable({apiKey: cred.API_KEY}).base(cred.BASE_ID);

module.exports = {
    getAdData : function(req, res) {
        let categoryLabels = { "Content Type" : ["Video", "Post", "Article"]},
            fields = ["Content Category", "Target Audience"],
            allRecords = [];
        base('Capstone Ad Data (April 25)').select({"fields" : fields}).eachPage(
            (records, getNextPage) => {
                allRecords = allRecords.concat(records);
                getNextPage();
            },
            (error) => {
                allRecords.forEach( record => {
                    fields.forEach( field => {
                        let category = record.fields[field]
                        if (category) {
                            if (!categoryLabels.hasOwnProperty(field)) {
                                categoryLabels[field] = []
                            } else {
                                if (!categoryLabels[field].includes(category)) {
                                    categoryLabels[field].push(category);
                                }
                            }
                        }
                    })
                })
                res.json({'data': categoryLabels});
            }
        )
    },

    getFormCat : function(req, res) {
        base('User Research').select({}).firstPage((error, records) => {
            res.json({data: records})
        })
    }
}