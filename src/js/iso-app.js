var isoRouter = require("./iso-router");
var React = require("react");

var FrontPage = React.createFactory(require('../jsx/front-page.jsx'));

var isoApp = function(options) {

  var renderApp = options.renderApp;
  var app = options.app;

  var buildFrontPage = function(req, res) {
    var content = FrontPage();
    renderApp(content, req, res);
  };

  var routes = {
    '/': buildFrontPage
  };

  isoRouter(routes, app);

}

module.exports = isoApp;