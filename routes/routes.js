//Scraping tools
var cheerio = require("cheerio");
var request = require("request");

//Models
var db = require("../models");

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get("/scrape", function (req, res) {

    request("https://www.dpreview.com/", function (error, response, html) {

      var $ = cheerio.load(html);

      $("div.content").each(function (i, element) {

        var result = {};

        result.title = $(this)
          .children('.header')
          .children('.title')
          .text();
        result.link = $(this)
          .children('.header')
          .children('.title')
          .children("a")
          .attr("href");
        result.excerpt = $(this)
          .children('.body')
          .children('p')
          .text();

        db.Article.find({ title: result.title }) // Prevents duplicates of articles. (Thanks, Jesse L.)
          .then(function (dbTitle) {
            console.log(dbTitle);
            if (dbTitle.length === 0) {
              if (result.title) {
                db.Article.create(result)
                  .then(function (dbArticle) {
                    console.log(dbArticle);
                  })
                  .catch(function (err) {
                    return res.json(err);
                  });
              }
            };
          })
          .catch(function (err) {
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client. Call it via function after success accounts for asynchroncity between modal and results loading.
      res.send("Scrape Complete");

    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    db.Article.find({})
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

}