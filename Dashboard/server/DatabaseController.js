const Airtable = require('airtable')
const cred = require('./config/config')

//Connect to Airtable base using api credentials
let base = new Airtable({apiKey: cred.ATB_API_KEY}).base(cred.BASE_ID);

module.exports = {
    //Retrieves all unique categorical values from airtable for each column
    getCategoryLabels : function(req, res) {
        let categoryLabels = {},
            fields = ["Content Category", "Target Audience", "Content Type", "Call To Action"],
            allRecords = [];

        base('Capstone Ad Data (April 25)').select({"fields" : fields}).eachPage(
            (records, getNextPage) => {
                allRecords = allRecords.concat(records);
                getNextPage();
            },
            (error) => {
                console.log(error)
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
    //Test function to examine api functionality
    getTableData : function(req, res) {
        //Table name is the argument to base
        base('User Research').select({}).firstPage((error, records) => {
            res.json({data: records})
        })
    }
    
}