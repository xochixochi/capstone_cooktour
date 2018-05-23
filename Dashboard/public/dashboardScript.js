
//Stores variables used to determine if additional input is needed.
var postEngagements = 0;
var linkClicks = 0;

$.get("/marketing").done( res => {
    for (let category in res.data) {
        res.data[category].forEach( label => {     
            $("#" + category.split(' ').join('')).append("<option value='"+ label + "'>" + label + "</option>");
        });
    }   
});

$(document).ready(() => {
    $('.engagement-select').addClass('selected');
    $('.goal').text("engagement");
    $('.conversion-results-top').hide();
    $('.engagement-results-top').hide();
    $('.traffic-inputs').hide();
    $('.conversion-inputs').hide();
    $('.loader').hide();

    $('.engagement-select').click(function(){
        $(this).addClass('selected');
        $('.traffic-select').removeClass('selected');
        $('.conversion-select').removeClass('selected');
        $('.conversion-results-top').hide();
        $('.traffic-results-top').hide();
        $('.engagement-results-top').show();
        $('.traffic-inputs').hide();
        $('.conversion-inputs').hide();

        //Auto loads previous post engagement value if exists and not zero
        if(postEngagements %= 0) {
            $('#PostEngagement').html(postEngagements);
        }
        $('#Objective').attr('value', 'Engagement')
        $('.goal').text("engagement");
    });

    $('.traffic-select').click(function(){
        $(this).addClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-select').removeClass('selected');
        $('.conversion-results-top').hide();
        $('.engagement-results-top').hide();
        $('.traffic-results-top').show();
        $('.traffic-inputs').show();
        $('.conversion-inputs').hide();
        $('#Objective').attr('value', 'Traffic');
        $('.goal').text("traffic");
    });

    $('.conversion-select').click(function(){
        $(this).addClass('selected');
        $('.traffic-select').removeClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-results-top').show();
        $('.traffic-results-top').hide();
        $('.engagement-results-top').hide();
        $('.traffic-inputs').show();
        $('.conversion-inputs').show();

        //Auto-loads previous link clicks value if exists and not zero
        if(linkClicks %= 0) {
            $('#LinkClicks').html(linkClicks);
        }
        $('#Objective').attr('value', 'Conversion');
        $('.goal').text("conversion");
    });

    //Should handle all functionality when a user clicks submit. Three cases should be for each campaign goal and then make calls
    //For each metric
    $('#algo').on("submit", function(e) {
        e.preventDefault();
        $('.loader').show();
        $('#algo').hide();
        
        //Post call for handling a unique submit press
        $.post('/predict', $('#algo').serialize(), function(data) {
            console.log(data)
            // predictedRow = JSON.parse(data);
            // predictedValueIndex = predictedRow['Results']['output1']['value']['ColumnNames'].indexOf('Scored Label Mean');
            // predictedValue = predictedRow.Results.output1.value.Values['0'][predictedValueIndex];
            // $('#estimate').empty();
            
            // //Add a conditional handler to determine which of the different outputs to handle, will prob need a unique funtion for 
            // //each campaign goal and then handle within that individually.
            // $('#estimate').append(predictedValue);
           },
           'json'
        );
        $('.loader').hide();
        $('#algo').show();
        return false;
    });
});

metricMap = {
    "Engagement" : [
        "post-engagement",
        "page-engagements",
    ],
    "Traffic" : [
        "click-through-rate",
        "link-clicks",
        "cost-per-click",
    ],
    "Conversion" : [
        "conversion-rate",
        "num-conversions",
        "cost-per-conversion"
    ]
}