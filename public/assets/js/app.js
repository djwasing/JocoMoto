$(document).ready(() => {
    $(".scrape").click(function(event) {
        event.preventDefault();
        $.get("/scrape").then(function(data) {
            //console.log("removed");
            $.get("/").then(function(){
                console.log("scraped");
                $(".close").click(function() {
                    location.reload();
                })
            });
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

    // Save the article- update the saved value to TRUE

    $(".save-article").click(function() {
        var articleToSave = {};
        articleToSave.id = $(this).data("id");
        console.log("id"+articleToSave.id);
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function(data) {
            location.reload();
        });
    });

    $('.saved-buttons').on('click',  function () {
        // the article id
        var thisId = $(this).attr("data-value");
  
        //attach news article _id to the save button in the modal for use in save post
        $("#saveButton").attr({"data-value": thisId});
  
        //make an ajax call for the notes attached to this article
        $.get("/notes/" + thisId, function(data){
            
            console.log("line 53 data to append to modal", data);
            //empty modal title, textarea and notes
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');
  
            //delete button for individual note
  
            //add id of the current article to modal label
            $('#noteModalLabel').append(' ' + thisId);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.note.length; i++) {
                console.log("loop for data", data.note[i]);
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].content + '  ' + button + '</div></div>');
            }
        });

    });

    $(".savenote").on('click', function() {
        var thisId = $(this).attr("data-value"); //get ID associated to the article from the submit btn
        $.ajax({
            method: "POST",
            url: "/notes/" + thisId,
            data: {
                body: $("#notestext").val().trim()
            }
        })
        .done(function(data) {
            $('#noteModal').modal('hide');
        });
    });

    $("#addCheckNote").on('click', function() {
        var thisId = $(this).attr("data-value"); // get the id for the note
        console.log("ID for the saved notes", thisId);
        $.ajax({
            method: "GET",
            url: "/notes/" + thisId,
            data: {
                body: content
            }
        })
        .done(function(data) {
            console.log("front-end notes to append",data);
            $('#noteBody').append(data);
        })
    })

    $('.removeSaved').on('click', function() {
        console.log("remove clicked");
        var articleToRemove = {};
        articleToRemove.id = $(this).data("id");
        console.log(articleToRemove);
        articleToRemove.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToRemove
        }).then(function(data) {
            location.reload();
        });

    })

}) 