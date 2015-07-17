var React = require("react");

var FrontPage = React.createFactory(require('../jsx/front-page.jsx'));
var Song = React.createFactory(require('../jsx/song.jsx'))

var isoApp = function(options) {

  var renderApp = options.renderApp;
  var app = options.app;
  var getShows = options.getShows;

  app.get('/song/:title', function(req, res) {
    var title = req.params.title;
    var content = Song({song: {title: title}});
    renderApp(content, req, res);
  });

  app.get('/', function(req, res) {
    getShows(function(err, shows) {
      var content = FrontPage({shows:shows});
      renderApp(content, req, res);
    });
  });

}

module.exports = isoApp;