
//Stores variables used to determine if additional input is needed.
var postEngagements = 0;
var linkClicks = 0;

$.get("/marketing").done( res => {
    console.log(res.data)
    for (let category in res.data) {
        res.data[category].forEach( label => {     
            $("#" + category.split(' ').join('')).append("<option value='"+ label + "'>" + label + "</option>");
        });
    }   
});

$(document).ready(() => {


    $('.engagement-select').addClass('selected');
    $('.goal').text("traffic");
    $('.conversion-results-top').hide();
    $('.engagement-results-top').hide();
    $('.traffic-inputs').hide();
    $('.conversion-inputs').hide();

    $('.traffic-select').click(function(){
        $(this).addClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-select').removeClass('selected');
        $('.conversion-results-top').hide();
        $('.engagement-results-top').hide();
        $('.traffic-results-top').show();
        $('.traffic-inputs').show();
        $('.conversion-inputs').hide();
        $('.goal').text("traffic");
    });

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
        $('.goal').text("engagement");
    });

    $('.conversion-select').click(function(){
        $(this).addClass('selected');
        $('.traffic-select').removeClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-results-top').show();
        $('.traffic-results-top').hide();
        $('.engagement-results-top').hide();
        $('.traffic-inputs').hide();
        $('.conversion-inputs').show();

        //Auto-loads previous link clicks value if exists and not zero
        if(linkClicks %= 0) {
            $('#LinkClicks').html(linkClicks);
        }
        $('.goal').text("conversion");
    });

    //Should handle all functionality when a user clicks submit. Three cases should be for each campaign goal and then make calls
    //For each metric
    $('#algo').on("submit", function(e) {
        e.preventDefault();
        
        //Post call for handling a unique submit press
        $.post('/predict', $('#algo').serialize(), function(data) {
            predictedRow = JSON.parse(data);
            predictedValueIndex = predictedRow['Results']['output1']['value']['ColumnNames'].indexOf('Scored Label Mean');
            predictedValue = predictedRow.Results.output1.value.Values['0'][predictedValueIndex];
            
            //Add a conditional handler to determine which of the different outputs to handle, will prob need a unique funtion for 
            //each campaign goal and then handle within that individually.
            $('#estimate').append(predictedValue);
           },
           'json'
        );
        return false;
    });
})