
$.get("/marketing").done( res => {
    console.log(res.data)
    for (let category in res.data) {
        res.data[category].forEach( label => {
            console.log(label);       
            $("#" + category.split(' ').join('')).append("<option value='"+ label + "'>" + label + "</option>");
        });
    }   
});

('#algo').submit( function() {
    $.post('/predict', $('#algo').serialize(), function(data) {
        
       },
       'json'
    );
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
    })

})