const reqGen = require('./MLRequestGenerators');

module.exports = {
    createMetricPredictionHandlers : (initialStage, metricMap, finalizeResults) => {
        let handlers = {}
        let metricCount = getMetricCount(metricMap);
        for(stage in metricMap) {
            handlers[stage] = {}
            for (metric of metricMap[stage]) {
                handlers[stage][metric] = handleOrdinaryMetricPrediction(metric, metricCount, finalizeResults);
            }
        }
        switch(initialStage) {
            case "Engagement":
                handlers["Engagement"]["PostEngagement"] = handleSpecialMetricPrediction("PostEngagement", handlers, "Traffic");
                handlers["Traffic"]["LinkClicks"] = handleSpecialMetricPrediction("LinkClicks", handlers, "Conversion");
                break;
            case "Traffic":
                handlers["Traffic"]["LinkClicks"] = handleSpecialMetricPrediction("LinkClicks", handlers, "Conversion");
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

handleSpecialMetricPrediction = (metric, handlers, nextStageToPredict) => {
    return (predictedValue, formInputs, results) => {
        addPredictionToResults(metric, predictedValue, results)
        formInputs[metric] = Math.round(predictedValue);
        console.log("form inputs now")
        console.log(formInputs);
        reqGen.makePredictionRequestsForStage(nextStageToPredict, handlers, formInputs, results);
    } 
}

handleOrdinaryMetricPrediction = (metric, metricCount, finalizeResults) => {
    return (predictedValue, formInputs, results) => {
        addPredictionToResults(metric, predictedValue, results);
        //If all Predictions have returned results send them back to the client side
        if (Object.keys(results).length == metricCount) {
            finalizeResults(results, formInputs);
        }
    }
}

addPredictionToResults = (metric, value, results) => {
    results[metric] = value;
}
