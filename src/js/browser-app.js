var React = require("react");
var App = require('../jsx/app.jsx');
var xhr = require('xhr');
var app = {
  get: require("./browser-app-get")
}

var getShows = function(callback) {
  xhr("/shows.json", function(err, res, body) {
    var shows = JSON.parse(body);
    callback(err, shows);
  });
}

/*

  renderApp
  ---------
  browser version

*/

var renderBrowserApp = function(content, req, res, opts) {
  React.initializeTouchEvents(true);
  React.render(<App content={content} opts={opts}/>, document.getElementById('container'));
};

/*

  isoApp
  --------
  browser version

*/

var isoApp = require("./iso-app")({
  renderApp: renderBrowserApp,
  getShows: getShows
});
