
$.get("/marketing").done( res => {
    console.log(res.data)
    for (let category in res.data) {
        res.data[category].forEach( label => {     
            $("#" + category.split(' ').join('')).append("<option value='"+ label + "'>" + label + "</option>");
        });
    }   
});

$(document).ready(() => {
    $('.all-metrics-top').hide();
    $('.all-metrics').click(function(){
        $(this).addClass('selected');
        $('.overview').removeClass('selected');
        $('.conversion-results-top').hide();
        $('#results-bottom').hide();
        $('.all-metrics-top').show();
    });
    $('.overview').click(function(){
        $(this).addClass('selected');
        $('.all-metrics').removeClass('selected');
        $('.conversion-results-top').show();
        $('#results-bottom').show();
        $('.all-metrics-top').hide();
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