var React = require("react");
require('node-jsx').install({extension: '.jsx'});
var express = require('express');
var app = express();

var publicDir = __dirname + '/../../public';

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.set('views',__dirname+'/../ejs');
app.use(express.static(publicDir));

if (process.env.NODE_ENV == "development") {
  var livereload = require('livereload');
  var watchGlob = require('watch-glob');
  var exec = require('exec');
  server = livereload.createServer({exts: ['js','css']});
  server.watch(publicDir);
  watchGlob([ 'src/scss/**/*.+(scss)' ], function(changedFile) {
    console.log("Reloading SCSS")
    exec(['make','build_debug_css','-C',__dirname+'/../../'], function(err, out, code) {
      console.log(err, out, code);
    });
  });
}

var DEFAULT_TITLE = "Willie & Allie";

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*

  renderApp
  ---------
  server version

*/

var renderServerApp = function(content, req, res, opts) {
  var App = React.createFactory(require('../jsx/app.jsx'));
  var HTML = React.renderToStaticMarkup(App({
    content: content,
    opts: opts
  }));
  res.render('index', { HTML: HTML, content: content, default_title: DEFAULT_TITLE });
};

/*

  isoApp
  ------
  server version

*/

var isoApp = require("./iso-app")({
  renderApp: renderServerApp,
  app: app
});