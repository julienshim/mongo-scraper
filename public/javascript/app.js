//Init
getArticles();

//When you Scrape New Articles 
$("#snaButton").on("click", function () {

  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
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
    .then(function (data) {
      console.log(data);
      if (data.length === 0) {
        $("#articles").append(`<br><br><h2 class="text-center text-muted">Click 'Scrape New Articles' to get start.</h2>`);
      } else {
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
          var noteButtonText;
          var buttonStyle;
          if (data[i].note !== undefined) {
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

//When you click view note button.
$(document).on("click", ".commentButton", function () {
  $("#modal-body").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {

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


//When you click the save note button.
$(document).on("click", ".saveButton", function () {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {

      console.log(data);

      $('#articleModal').modal('hide');

      getArticles();

    });
});