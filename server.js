//Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");

//
const app = express();
const PORT = process.env.PORT || 3333;

//Mongoose per MDN / Mongoose documentation.
const databaseUrl = 'mongodb://127.0.0.1/mongoHeadlines'; // database name per HW instructions
mongoose.connect(databaseUrl);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("We're connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//Routes
require("./routes/html-api-routes.js")(app);
require("./routes/article-api-routes.js")(app);
require("./routes/note-api-routes.js")(app);

//Server Start
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
});

