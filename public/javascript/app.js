$("#snaButton").on("click", function() {

  $.ajax({
    method: "GET",
    url: "/articles"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      for (var i = 0 ; i < data.length; i++) {
      $("#articles").append(`
        <div class="card">
          <div class="card-header font-weight-bold">${data[i].title}</div>
          <div class="card-body">
          <p class="card-text">${data[i].excerpt}</p>
            <a href="${data[i].link}" target="_blank" class="btn btn-light">View Article</a>
            <a href=#" data=${data[i]._id} class="btn btn-light">Save Article</a>
          </div>
      </div>`);
      }

      // <a href="${data[0].link}" target="_blank" class="btn btn-primary">Save Article</a>
      // // The title of the article
      // $("#articles").append("<h2>" + data[0].title + "</h2>");
      // // An input to enter a new title
      // $("#articles").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#articles").append("<button data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");
    });
});