# Adticipate

Successful marketing strategies can be expensive and elusive for startups running on limited personnel and budget. Mistargeted ad campaigns often result in failure, wasting time and resources. Adticipate offers startups a marketing workflow and Facebook ad campaign algorithm combined with machine learning that guarantees predictable results with minimal effort.

## The Workflow

Our project provides small businesses with a marketing workflow that they can use in accordance with our dashboard in order to increase the effectiveness and targeting of their Facebook Ads to optimize:
* engagement - Interactions that people have with a given ad and Facebook page
* traffic - Movement from an ad on Facebook to a website or landing page
* conversions - The actual conversion of a viewer to a customer as a result from an ad

### Creating a Baseline using Facebook Ads
Machine learning typically requires "big data”, or large amounts of data, but as we optimized our algorithm for small businesses, we only required approximately 100 (or more) rows of data. Each row represents an individual Facebook ad and ultimately helps our algorithm make predictions. For each ad, several inputs must be provided in order to make predictions on. For example, Adticipate requires the following inputs to predict metrics for engagement ad campaigns:
* Target Audience (selected marketing audience on Facebook)
* Content Category (The general theme of the ad)
* Content Type (video, image or event)
* Call to Action (What the ad asks the user to do)
* Amount spent on the ad

### Downloading Data with Facebook Ads Manager
Once the necessary data has been collected with Facebook Ads, the next step is to download this data. Facebook Ads Manager is a tool that allows users to download a multitude of input and output data for individual ads. For this, Adticipate takes the inputs that have been selected, as well as appropriate outputs, and download the values in order to use with machine learning. Some examples of outputs that have been used include:
* Page Engagements
* Post Engagements 
* Link Clicks
* Number of Conversions

This data can be downloaded as a .csv or other file and can also be connected to cloud data storage to allow for regular updates. Once new ads are deployed on Facebook, it should update the availible data.

### Storing The Data

Ad data should be stored either locally or on cloud storage. Optionally, the data can be updated regularly by using scripts. The company we worked with initially, Cooktour, used Airtable as a way to store their data. This serves as a central location for the data to be pulled from by the dashboard and by Azure Machine Learning.

### Training The Machine Learning Models

Each output variable desired requires an individual machine learning model -- which consists of a training model and a prediction model that deploys to a web service. Models are trained using Bayesian Linear Regression, which works for both smaller and larger data sets well. All models are trained and deployed in Azure Machine Learning Studio, which has an easy drag and drop interface. Newly run ads should be used to stregnthen the model.

## The Dashboard
![Dashboard Screenshot](https://github.com/jkinsfat/capstone_cooktour/blob/master/dashboard.PNG "The Dashboard")

The dashboard allows a user to view various comparative information about the ads that they have ran. A user can use this dashboard to predict individual values based on inputs, or they can hold all inputs constant, except one, in order to compare how the predicted metrics compare across the manipulated input. In this screenshot, a user is comparing page engagement metric based on the given inputs on the left across all target audiences. They should be able to see that the ad with the given inputs will be most effective for the Lookalike 1% Website Visitors Audience (a Facebook created audience).

### Campaign Goal

Changing the campaign goal allows a user to select whether they want to make predictions for engagement, traffic or conversion ad campaigns.

## Algorithm Input

The algorithm input allows a user to select inputs in order to make estimates for a "mock ad". The values in the boxes are locked to certain ranges to ensure that the machine learning algorithm makes guesses within a realistic scope of previously deployed Facebook ad campaigns.

## Compare Predictions

Compare predictions allows a user to compare the estimates for a metric across a single variable. This allows for easy optimization of ads by manipulating single values. The two bars represent the base amount spend and the amount spent plus a certain value (in this case it is $5) so that the user can see how spending more money effects the value of the metric in case the relationship in non-linear.

## Built With

* [Facebook Business](https://www.facebook.com/business/products/ads)
* [Facebook Ads Manager](https://www.facebook.com/business/learn/facebook-ads-reporting-ads-manager)
* [Airtable](https://airtable.com/)
* [Azure Machine Learning Studio](https://studio.azureml.net/)
* [jquery](https://jquery.com/)
* [plotly](https://plot.ly/)
* [bootstrap](https://getbootstrap.com/)

## Authors

* Trevor Bruecher - tabruecher@gmail.com
* Jason Kinsfather - jkinsfat@uw.edu
* Tammy Yu - tamtammyu@gmail.com

## Acknowledgements
* Thanks to Edgar Romo and Julia Kimmig for sponsoring us and giving us support all the way
* [Cooktour](https://www.cooktour.com/) - Our sponors
* Frank Martinez and Zithri Saleem
* [WeWork Westlake Tower](https://www.wework.com/buildings/westlake-tower--seattle--WA?&utm_campaign=766642937&utm_term=kwd-75333151482&utm_source=ads-google&utm_medium=cpc&gclid=CjwKCAjw3cPYBRB7EiwAsrc-ueGgbj-ZVjVC2R1wyvAvP_VkpVziavM0xye4GegHGVsDWzg6g8uK2xoC2o8QAvD_BwE&gclsrc=aw.ds&dclid=CLbGj4jhs9sCFYIFrQYd_DsD2w)
* Everyone who let us interview them or use them for user research
* Everyone in our class who provided us feedback

