var React = require("react");

var FrontPage = React.createFactory(require('../jsx/front-page.jsx'));
var Song = React.createFactory(require('../jsx/song.jsx'))

var isoApp = function(options) {

  var renderApp = options.renderApp;
  var app = options.app;
  var getShows = options.getShows;

  app.get('/song/:title', function(req, res) {
    console.log("song", req, res);
    var title = req.params.title;
    var content = Song({song: {title: title}});
    renderApp(content, req, res);
  });

  app.get('/', function(req, res) {
    console.log("front-page");
    getShows(function(err, shows) {
      var content = FrontPage({shows:shows});
      renderApp(content, req, res);
    });
  });

  app.get('/bleep', function(req, res) {
    console.log("bleep");
    getShows(function(err, shows) {
      var content = FrontPage({shows:shows});
      renderApp("123", req, res);
    });
  });

  return app;

}

module.exports = isoApp;