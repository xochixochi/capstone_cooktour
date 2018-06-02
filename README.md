# Adticipate

Successful marketing strategies can be expensive and elusive for startups running on limited personnel and budget. Mistargeted ad campaigns often result in failure, wasting time and resources. Adticipate offers startups a marketing workflow and Facebook ad campaign algorithm combined with machine learning that guarantees predictable results with minimal effort.

## The Workflow

Our project provides small businesses with a workflow that they can use in accordance with our dashboard in order to increase the effectiveness and targeting of their Facebook Ads in order to optimize 
* traffic - How people move from an ad to a website or link displayed within it
* engagement - The number of interactions that people provide to a given ad and Facebook page
* conversions - The actual purchases of a product that result from an ad

### Creating a Baseline usine Facebook Ads
Machine learning usually requires "big data" but as we optimized our algorithm for small businesses, we only require approximately 100 ( or more) rows of data, with each one being an individual ad, in order to be able to make predictions! For each ad, several inputs should be varied that you wish to make predictions on. For example, we used
* Target Audience (selected marketing audience on Facebook)
* Content Category (The general theme of the ad)
* Content Type (video, image or event)
* Call to Action (What the ad asks the user to do)
* Amount spent on the ad

### Downloading Data with Facebook Ads Manager
Once the necessary data has been collected with Facebook Ads, the next step is to download this data. Facebook Ads Manager is a tool that allows a user to download a multitude of input and output data for individual ads. For this, we take the inputs that have been selected as well as appropriate outputs and download their values in order to use with machine learning. Some examples of outputs that have been used are 
* Page Engagements
* Post Engagements 
* Link Clicks
* Number of Conversions

This data can be downloaded as a csv or other file and it can also be connected to cloud data storage in order to regularly update.

### Storing The Data

Ad data should be stored either locally or cloud storage, and can optionally updated regualrly using scripts. The company we worked with initially, Cooktour, used Airtable as a way to store their data. This serves as a cental location for the data to be pulled from by the dashboard and by Azure Machine Learning.

### Training The Machine Learning Models

Each output variable desired requires an individual machine learning model -- which consists of a training model and a prediction model that deploys to a web service. Models are trained using Bayesian Linear Regression, which works for both smaller and larger data sets well. All models are trained and deployed in Azure Machine Learning Studio, which has an easy drag and drop interface.

## The Dashboard



## Deployment

### Use

## Built With

## Authors

## Acknowledgements


