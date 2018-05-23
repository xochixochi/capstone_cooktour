const mm = require("./config/metricMap");
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
        let results = {},
            predictionHandlers = handGen.createMetricPredictionHandlers(initialStage, mm.metricMap, finalizeResponse);

        switch(initialStage) {
            case "Engagement":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body, results);
                break;
            case "Traffic":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body, results);
                reqGen.makePredictionRequestsForStage("Engagement", predictionHandlers, req.body, results);
                break;
            case "Conversion":
                reqGen.makePredictionRequestsForStage(initialStage, predictionHandlers, req.body, results);
                reqGen.makePredictionRequestsForStage("Traffic", predictionHandlers, req.body, results);
                reqGen.makePredictionRequestsForStage("Engagement", predictionHandlers, req.body, results);
                break;
        }
    }
}

