



module.exports = {
    createMetricPredictionHandlers : (initialStage) => {
        let handlers = {}
        for(stage in metricMap) {
            handlers[stage] = {}
            for (metric in metricMap[stage]) {
                handlers[stage][metric] = handleOrdinaryMetricPrediction(metric)
            }
        }
        if (initialStage == "Engagement") {
            handlers[initialStage]["PageEngagement"] == "This function"
            //Add page engamgent to form inputs and results
            //Now create and send all requests for the traffic stage
            handlers["Traffic"]["LinkClicks"] == "this"
            //Add link clicks to form inputs and results
            //now create and send all requests for the conversion stage
        } else if (initialStage == "Traffic") {

        } else if (initialStage == "Conversion") {

        }
        return handlers;
    }
}

let metricMap = {
    "Engagement" : [
        "PostEngagement",
        "PageEngagement",
    ],
    "Traffic" : [
        "ClickThroughRate",
        "LinkClicks",
        "CostPerClick",
    ],
    "Conversion" : [
        "ConversionNumber"
    ]
}


handleOrdinaryMetricPrediction = (metric, metricCount, sendResults) => {
    return (prediction, formInputs, results) => {
        addPredictionToResults(metric, prediction["Scored Label Mean"], results);
        //If all Predictions have returned results send them back to the client side
        if (results.length == metricCount) {
            sendResults(results);
        }
    }
}

addPredictionToResults = (metric, value, results) => {
    results[metric] = value;
}

