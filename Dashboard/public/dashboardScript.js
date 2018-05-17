
$.get("/marketing").done( res => {
    console.log(res.data)
    for (let category in res.data) {
        res.data[category].forEach( label => {     
            $("#" + category.split(' ').join('')).append("<option value='"+ label + "'>" + label + "</option>");
        });
    }   
});

$(document).ready(() => {


    $('.traffic-select').addClass('selected');
    $('.goal').text("traffic");
    $('.conversion-results-top').hide();
    $('.engagement-results-top').hide();

    $('.traffic-select').click(function(){
        $(this).addClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-select').removeClass('selected');
        $('.conversion-results-top').hide();
        $('.engagement-results-top').hide();
        $('.traffic-results-top').show();
        $('.goal').text("traffic");
    });

    $('.engagement-select').click(function(){
        $(this).addClass('selected');
        $('.traffic-select').removeClass('selected');
        $('.conversion-select').removeClass('selected');
        $('.conversion-results-top').hide();
        $('.traffic-results-top').hide();
        $('.engagement-results-top').show();
        $('.goal').text("engagement");
    });

    $('.conversion-select').click(function(){
        $(this).addClass('selected');
        $('.traffic-select').removeClass('selected');
        $('.engagement-select').removeClass('selected');
        $('.conversion-results-top').show();
        $('.traffic-results-top').hide();
        $('.engagement-results-top').hide();
        $('.goal').text("conversion");
    });

    $('#algo').on("submit", function(e) {
        e.preventDefault();  
        $.post('/predict', $('#algo').serialize(), function(data) {
            predictedRow = JSON.parse(data);
            predictedValueIndex = predictedRow['Results']['output1']['value']['ColumnNames'].indexOf('Scored Label Mean');
            predictedValue = predictedRow.Results.output1.value.Values['0'][predictedValueIndex];
            $('#estimate').append(predictedValue);
           },
           'json'
        );
        return false;
    });
})