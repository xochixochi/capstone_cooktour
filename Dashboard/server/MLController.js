const request = require("request");
const cred = require("./config/config")

module.exports = {
    predict : (req, res) => {
        console.log(req.body)
        
        let requestData = {
            "Inputs": {
              "input1": {
                "ColumnNames": [
                  "Amount Spent (USD)",
                  "Post Engagement",
                  "Objective",
                  "Target Audience"
                ],
                "Values": [
                  [
                    "10",
                    "0",
                    req.body.Objective,
                    req.body.TargetAudience
                  ]
                ]
              }
            },
            "GlobalParameters": {}
          }

        let options = {
            uri: cred.AML_URI,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + cred.AML_API_KEY,
            },
            body: JSON.stringify(requestData)
        }

        request(options, (err, ml_res, body) => {
            if (!err && ml_res.statusCode == 200) {
                console.log(body);
                res.json(body);
            } else {
                console.log(ml_res.statusCode);
                res.json({"message": "failure"});
            }
        });
    }
}