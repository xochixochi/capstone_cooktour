const cred = require('./config/config');
const mm = require('./config/metricMap');
const request = require('request');

module.exports = {
    generateResultFinalizationFunction : (res) => {
        return (results, formInputs) => {
            //add derived data to results
            results["CostPerClick"] = results["LinkClicks"] / formInputs.AmountSpent;
            results["CostPerConversion"] = results["ConversionNumber"] / formInputs.AmountSpent;
            res.json(results);
        }
    },
    makePredictionRequestsForStage : (campaignStage, resHandlers, formInputs, results) => {
        for (metric of mm.metricMap[campaignStage]) {
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
            //Fixes problem with campaign stage scoping, need to find less hacky solution
            let cs = campaignStage
            let m = metric
            request(options, (err, ml_res, prediction) => {
                if (!err && ml_res.statusCode == 200) {   
                    let predictedValue = getPredictedValue(prediction);     
                    resHandlers[cs][m](predictedValue, formInputs, results);
                } else {
                    res.json({"message": "failure"});
                }
            });
        }
    },
}

getPredictedValue = (prediction) => {
    parsedPrediction = JSON.parse(prediction);
    let predictedValueIndex = parsedPrediction['Results']['output1']['value']['ColumnNames'].indexOf('Scored Label Mean');
    let predictedValue = parsedPrediction.Results.output1.value.Values['0'][predictedValueIndex];
    return predictedValue;
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
    baseData.inputs.push(inputs.PostEngagement);
    baseData.inputs[baseData.features.indexOf('Objective')] = "Traffic";
    console.log(baseData.features);
    console.log(baseData.inputs);
    return baseData;
}

packageConversionRequestData = (inputs) => {
    let baseData = packageTrafficRequestData(inputs);
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