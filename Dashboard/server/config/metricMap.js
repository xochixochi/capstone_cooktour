const cred = require('./config');
//Maps predictable metrics to their corresponding marketing campaign stages.
const metricMap = {
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
module.exports = {
    getCampaignStages : () => Object.keys(metricMap),
    getMetrics : (campaignStage) => metricMap[campaignStage],
    getURI : (campaignStage, metric) => cred.ML_CRED[campaignStage][metric].URI,
    getAPI_KEY : (campaignStage, metric) => cred.ML_CRED[campaignStage][metric].API_KEY,
    getMetricCount : () => {
        let count = 0;
        for (stage in metricMap) {
            for (metric in metricMap[stage]) {
                count += 1;
            }
        }
        return count;
    }
}
