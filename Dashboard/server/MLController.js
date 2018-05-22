const request = require("request");
const cred = require("./config/config");
const metrics = require("./config/metricMap");
let predictInProgress = false;

module.exports = {
    predict : (req, res) => {
        ////May need to handle double form submission??
        // if (predictInProgress) {
        //     res.json({"error" : "Must wait for last prediction to run its course"});
        //     return;
        // } 
        let predictedResults = {}
        let predictionHandlers = metrics.createMetricPredictionHandlers(req.body.Objective);
        makePredictionRequestsForStage(req.body.Objective, req.body)
    }
}

makePredictionRequestsForStage = (campaignStage, formInput, predictedResults) => {
    for (metric in metrics[campaignStage]) {
        let requestBody = createPredictionRequestBody(campaignStage, formInputs);
        let options = {
            uri: cred.ML_CRED[campaignStage][metric].URI,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + cred.ML_CRED[campaignStage][metric].API_KEY,
            },
            body: JSON.stringify(requestBody)
        }
        request(options, (err, ml_res, prediction) => {
            if (!err && ml_res.statusCode == 200) {
                
            } else {
                console.log(ml_res.statusCode);
                res.json({"message": "failure"});
            }
        });
    }
}

let createPredictionRequestBody = (campaignStage, inputs) => {
    let requestData = packageDataForStage[campaignStage](inputs),
        requestBody = {
            "Inputs": {
                "input1": {
                    "ColumnNames": requestData.features,
                    "Values": [
                        requestData.inputs
                    ]
                }
            },
            "GlobalParameters": {}
        };
    return requestBody;
}

packageEngagementRequestData = (inputs) => {
    return { 
        "features" : [
            "Content Type",
            "Amount Spent (USD)",
            "Objective",
            "Target Audience",
            "Content Category"
        ],
        "inputs" : [
            inputs.ContentType,
            inputs.AmountSpent,
            "Engagement",
            inputs.TargetAudience,
            inputs.ContentCategory
        ]
    }
}

packageTrafficRequestData = (inputs) => {
    let baseData = packageEngagementRequestData(inputs)
    baseData.features.push("Post Engagement");
    baseData.inputs.push(inputs.PostEngagment);
    baseData.inputs[baseData.features.indexOf('Objective')] = "Traffic";
    return baseData;
}

packageConversionRequestData = (inputs) => {
    let baseData = packageTrafficRequestData(inputs);
    console.log(baseData.features)
    baseData.features.push("Link Clicks");
    baseData.inputs.push(inputs.LinkClicks);
    baseData.inputs[baseData.features.indexOf('Objective')] = "Conversion";
    return baseData;
}

let packageDataForStage = {
    "Engagement" : packageEngagementRequestData,
    "Traffic" : packageTrafficRequestData,
    "Conversion" : packageConversionRequestData
}