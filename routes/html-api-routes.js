//Render index.handelbars on root page load.
module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index');
      });

};