const mm = require('./config/metricMap');
const reqGen = require('./MLRequestGenerators');

let addPredictionToResults = (metric, value, results) => {
    results[metric] = value;
}
let resultsFinishedLoading = (totalPredictions, results) => Object.keys(results).length == totalPredictions

module.exports = {
    addPredictionToResults : addPredictionToResults,
    resultsFinishedLoading : resultsFinishedLoading,
    createMLResponseCallbacks : (initialStage, finalizeResults) => {
        let handlers = {}
        let metricCount = mm.getMetricCount();
        for(let stage of mm.getCampaignStages()) {
            handlers[stage] = {}
            for (let metric of mm.getMetrics(stage)) {
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
    },
    makeNewResults : () => {return {}},
}
let predictMetricsForStage = (campaignStage, resHandlers, formInputs, results) => {
    for (let metric of mm.getMetrics(campaignStage)) {
        let callback = (predictedValue) => {
                resHandlers[campaignStage][metric](predictedValue, formInputs, results);
            }
        reqGen.sendMLPredictionRequest(
            reqGen.createPredictionRequestBody(campaignStage, formInputs),
            mm.getURI(campaignStage, metric),
            mm.getAPI_KEY(campaignStage, metric),
            callback
        );
    }
}
let handleSpecialMetricPrediction = (metric, handlers, nextStageToPredict) => {
    return (predictedValue, formInputs, results) => {
        addPredictionToResults(metric, predictedValue, results);
        formInputs[metric] = Math.round(predictedValue);
        predictMetricsForStage(nextStageToPredict, handlers, formInputs, results);
    } 
}

let handleOrdinaryMetricPrediction = (metric, metricCount, finalizeResults) => {
    return (predictedValue, formInputs, results) => {
        addPredictionToResults(metric, predictedValue, results);
        //If all Predictions have returned results send them back to the client side
        if (resultsFinishedLoading(metricCount, results)) {
            finalizeResults(results, formInputs);
        }
    }
}
