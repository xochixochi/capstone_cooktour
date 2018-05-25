const request = require('request');

module.exports = {
    //Derives additional data from and adds it to results and then sends the results using the given response object.
    finalizeResults : (res) => {
        return (results, formInputs) => {
            //add derived data to results
            results["CostPerClick"] = results["LinkClicks"] / formInputs.AmountSpent;
            results["CostPerConversion"] = results["ConversionNumber"] / formInputs.AmountSpent;
            res.json(results);
        }
    },
    sendMLPredictionRequest : (requestBody, URI, API_KEY, callback) => {
        let options = {
            uri: URI,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY,
            },
            body: JSON.stringify(requestBody)
        }
        request(options, (err, ml_res, prediction) => {
            if (!err && ml_res.statusCode == 200) {   
                let predictedValue = retrievePredictedValue(prediction);   
                callback(predictedValue);
            } else {
                console.log("uh oh, there was a failure!")
            }
        });
    },
    //returns formatted request body for the ML API
    createPredictionRequestBody : (campaignStage, inputs) => {
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
}
//retrieves and returns the predicted value from the ML algorithm response 
let retrievePredictedValue = (prediction) => {
    parsedPrediction = JSON.parse(prediction);
    let predictedValueIndex = parsedPrediction['Results']['output1']['value']['ColumnNames'].indexOf('Scored Label Mean');
    let predictedValue = parsedPrediction.Results.output1.value.Values['0'][predictedValueIndex];
    return predictedValue;
}
//Formats the column names and values from the user input to conform to the ML engagement algorithms 
let packageEngagementRequestData = (inputs) => {
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
//Formats the column names and values from the user input to conform to the ML traffic algorithms
let packageTrafficRequestData = (inputs) => {
    let baseData = packageEngagementRequestData(inputs)
    baseData.features.push("Post Engagement");
    baseData.inputs.push(inputs.PostEngagement);
    baseData.inputs[baseData.features.indexOf('Objective')] = "Traffic";
    return baseData;
}
//Formats the column names and values from the user input to conform to the ML conversion algorithms
let packageConversionRequestData = (inputs) => {
    let baseData = packageTrafficRequestData(inputs);
    baseData.features.push("Link Clicks");
    baseData.inputs.push(inputs.LinkClicks);
    baseData.inputs[baseData.features.indexOf('Objective')] = "Conversion";
    return baseData;
}
//Maps packaging functions to thier respective campaign stages
let packageDataForStage = {
    "Engagement" : packageEngagementRequestData,
    "Traffic" : packageTrafficRequestData,
    "Conversion" : packageConversionRequestData
}