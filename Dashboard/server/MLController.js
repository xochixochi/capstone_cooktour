const mm = require("./config/metricMap");
const cred = require('./config/config');
const resGen = require("./MLResponseHandlerGenerators")
const reqGen = require("./MLRequestGenerators");
//Makes a call to each of the ML API endpoints that predict a relevant metric for the given campaign stage
//When the API responds with a metric prediction, calls the handler function for that metric.
module.exports = {
    csPredict : (req, res) => {
        let initialStage = req.body.Objective,
            finalizeResponse = reqGen.finalizeResults(res),
            resCallbacks = resGen.createMLResponseCallbacks(initialStage, finalizeResponse),
            results = resGen.makeNewResults();

        switch(initialStage) {
            case "Engagement":
                predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
            case "Traffic":
                predictMetricsForStage("Traffic", resCallbacks, req.body, results);
                predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
            case "Conversion":
                predictMetricsForStage("Conversion", resCallbacks, req.body, results);
                predictMetricsForStage("Traffic", resCallbacks, req.body, results);
                predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
        }
    },
    catPredict : (req, res) => {
        let metric = req.body.metric,
            column = req.body.column,
            categories = req.body.categories, //eventually might want to pull categories from airtable for now just pull them from the client side.
            inputs = req.body.inputs,
            campaignStage = inputs.Objective,
            results1 = resGen.makeNewResults();
            results2 = resGen.makeNewResults();
        
        console.log(inputs)
        //make call to endpoint associated with metric for each category varying the column value of inputs with the category name
        for (let category of categories) {
            inputs[column] = category;
            let callback1 = (predictedValue) => {
                    resGen.addPredictionToResults(category, predictedValue, results1);  
                    if (resGen.resultsFinishedLoading(categories.length, results1) && resGen.resultsFinishedLoading(categories.length, results2)) {
                        res.json([results1, results2]);
                    }
                }
            let callback2 = (predictedValue) => {
                resGen.addPredictionToResults(category, predictedValue, results2);
                if (resGen.resultsFinishedLoading(categories.length, results1) && resGen.resultsFinishedLoading(categories.length, results2)) {
                    res.json([results1, results2]);
                }
            }
            reqGen.sendMLPredictionRequest(
                reqGen.createPredictionRequestBody(inputs.Objective, inputs),
                mm.getURI(campaignStage, metric),
                mm.getAPI_KEY(campaignStage, metric),
                callback1
            );
            inputs["AmountSpent"] = Number(inputs["AmountSpent"]) + 5;
            let body = reqGen.createPredictionRequestBody(inputs.Objective, inputs)
            console.log(body.Inputs.input1.Values)
            reqGen.sendMLPredictionRequest(
                body,
                mm.getURI(campaignStage, metric),
                mm.getAPI_KEY(campaignStage, metric),
                callback2
            );
            inputs["AmountSpent"] = Number(inputs["AmountSpent"]) - 5;
        }
    },
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

    


