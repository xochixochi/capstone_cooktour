const reqGen = require('./MLRequestGenerators');

module.exports = {
    createMetricPredictionHandlers : (initialStage, metricMap, finalizeResults) => {
        let handlers = {}
        let metricCount = getMetricCount(metricMap);
        for(stage in metricMap) {
            handlers[stage] = {}
            for (metric in metricMap[stage]) {
                handlers[stage][metric] = handleOrdinaryMetricPrediction(metric)
            }
        }
        switch(initialStage) {
            case "Engagement":
                handlers[initialStage]["PageEngagement"] = (prediction, formInputs, results) => {
                    addPredictionToResults(metric, prediction["Scored Label Mean"], results)
                }
                //Add page engamgent to form inputs and results
                //Now create and send all requests for the traffic stage
                handlers["Traffic"]["LinkClicks"] = (metri)
                //Add link clicks to form inputs and results
                //now create and send all requests for the conversion stage
                break;
            case "Traffic":
                break;
            case "Conversion":
                break;
        }
        return handlers;
    }
}

getMetricCount = (metricMap) => {
    let count = 0;
    for (stage in metricMap) {
        for (metric in metricMap[stage]) {
            count += 1;
        }
    }
    return count;
}

handleOrdinaryMetricPrediction = (metric, metricCount, finalizeResults) => {
    return (prediction, formInputs, results) => {
        addPredictionToResults(metric, prediction["Scored Label Mean"], results);
        //If all Predictions have returned results send them back to the client side
        if (results.length == metricCount) {
            finalizeResults(results);
        }
    }
}

addPredictionToResults = (metric, value, results) => {
    results[metric] = value;
}

