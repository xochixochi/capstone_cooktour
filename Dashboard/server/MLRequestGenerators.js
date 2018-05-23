module.exports = {
    generateResultFinalizationFunction : (res) => {
        return (results, formInputs) => {
            //add derived data to results
            res.json(results);
        }
    },
    makePredictionRequestsForStage = (campaignStage, resHandlers, formInput, predictedResults) => {
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
                    resHandlers[campaignStage][metric](prediction, formInput, predictedResults);
                } else {
                    console.log(ml_res.statusCode);
                    res.json({"message": "failure"});
                }
            });
        }
    },
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