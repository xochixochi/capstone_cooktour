
$.get("/marketing").done(function(data) {
    console.log(data);
});

$(document).ready(() => {

    $('.all-metrics-top').hide();

    $('.all-metrics').click(function(){
        $(this).addClass('selected');
        $('.overview').removeClass('selected');
        $('.conversion-results-top').hide();
        $('#results-bottom').hide();
        $('.all-metrics-top').show();
    })

    $('.overview').click(function(){
        $(this).addClass('selected');
        $('.all-metrics').removeClass('selected');
        $('.conversion-results-top').show();
        $('#results-bottom').show();
        $('.all-metrics-top').hide();
    })

})