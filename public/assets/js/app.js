$(document).ready(() => {
    $(".scrape").click(function(event) {
        event.preventDefault();
        $.get("/scrape").then(function(data) {
            $(".articles").remove();
            $.get("/").then(function(){
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function(result) {
                  location.reload()
                });
            });
            //location.reload();
        });
    });

    $(".show").click(function(event) {
        event.preventDefault();
        $.get("/all").then(function(data) {
            $(".articles").remove();
            $.get("/").then(function(){
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function(result) {
                  location.reload()
                });
            });
            //location.reload();
        });
    });
}) 