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
            resCallbacks= handGen.createMLResponseCallbacks(initialStage, mm.metricMap, finalizeResponse);

        switch(initialStage) {
            case "Engagement":
                reqGen.predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
            case "Traffic":
                reqGen.predictMetricsForStage("Traffic", resCallbacks, req.body, results);
                reqGen.predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
            case "Conversion":
                reqGen.predictMetricsForStage("Conversion", resCallbacks, req.body, results);
                reqGen.predictMetricsForStage("Traffic", resCallbacks, req.body, results);
                reqGen.predictMetricsForStage("Engagement", resCallbacks, req.body, results);
                break;
        }
    }
}

