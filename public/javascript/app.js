getArticles();

$("#snaButton").on("click", function() {

  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      getArticles();
      $("#scrapeModal").modal();
    });

});


function getArticles() {

  $.ajax({
    method: "GET",
    url: "/articles"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      if (data.length === 0) {
        $("#articles").append(`<br><br><h2 class="text-center text-muted">Click 'Scrape New Articles' to get start.</h2>`);
      } else {
        $("#articles").empty();
        for (var i = 0 ; i < data.length; i++) {
          var noteButtonText;
          var buttonStyle;
          if (data[i].note !== undefined){
            noteButtonText = "View Note";
            buttonStyle = "btn-outline-info";
          } else {
            noteButtonText = "Add Note";
            buttonStyle = "btn-light";
          }
          $("#articles").append(`
            <div class="card">
              <div class="card-header font-weight-bold">${data[i].title}</div>
              <div class="card-body">
              <p class="card-text">${data[i].excerpt}</p>
                <a href="${data[i].link}" target="_blank" class="btn btn-outline-success">View Article</a>
                <a href=#" data-id=${data[i]._id} class="btn ${buttonStyle} commentButton">${noteButtonText}</a>
              </div>
          </div>`);
          }
      }
      

    });
};

$(document).on("click", ".commentButton", function() {
  // Empty the notes from the note section
  $("#modal-body").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {

      console.log(data);
      $("#modal-body").append(`<h4> Article: ${data.title}</h4>`);
      $("#modal-body").append("<hr>");
      $("#modal-body").append(`<input class="form-control" type="text" placeholder="Note Title" id="titleinput">`);
      $("#modal-body").append(`<textarea class="form-control" id='bodyinput' placeholder="Note Text Content" name='body' rows="3"></textarea>`);
      $(".saveButton").attr("data-id", data._id);

      if (data.note.body) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });

    $("#articleModal").modal();
});


// When you click the savenote button
$(document).on("click", ".saveButton", function() {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // console.log("IN HERE!");
      
      $('#articleModal').modal('hide');
      getArticles();
      // Empty the notes section
      // $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  
  
  // $("#bodyinput").val("")
});