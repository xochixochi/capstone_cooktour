const request = require("request");
const cred = require("./config/config");
const metricMap = require("./config/metricMap");
const handGen = require("./MLResponseHandlerGenerators")
const reqGen = require("./MLRequestGenerators");
let predictInProgress = false;

module.exports = {
    predict : (req, res) => {
        let initialStage = req.body.Objective
        ////May need to handle double form submission??
        // if (predictInProgress) {
        //     res.json({"error" : "Must wait for last prediction to run its course"});
        //     return;
        // }
        let finalizeResponse = reqGen.generateResultFinalizationFunction(res);
        let predictedResults = {},
            predictionHandlers = handGen.createMetricPredictionHandlers(initialStage, metricMap, finalizeResponse);

        switch(initialStage) {
            case "Engagement":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body);
                break;
            case "Traffic":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body);
                reqGen.makePredictionRequestsForStage("Engagement", predictionHandlers, req.body);
                break;
            case "Conversion":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body);
                reqGen.makePredictionRequestsForStage("Traffic", predictionHandlers, req.body);
                reqGen.makePredictionRequestsForStage("Engagement", predictionHandlers, req.body);
                break;
        }
    }
}

