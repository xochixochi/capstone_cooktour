$(document).ready(function() {
    $.get("/marketing").done(function(data) {
        console.log(data);
    })
})