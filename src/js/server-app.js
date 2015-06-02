var React = require("react");
require('node-jsx').install({extension: '.jsx'});
var request = require('request');
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

  Shows
  -----
  Google spreadsheet: https://docs.google.com/spreadsheets/d/1tjdhFFV737AdOS9OSwH7ZItsHIsCA044P9vrdKp25Fs/edit#gid=0

*/

var showsUri = "https://docs.google.com/spreadsheets/d/1tjdhFFV737AdOS9OSwH7ZItsHIsCA044P9vrdKp25Fs/gviz/tq?&tq&gid=0";

var getShows = function(callback) {
  var shows = [];
  request(showsUri, function(err, res, body) {
    var dataJSON = body.split("(")[1].split(")")[0];
    var data = JSON.parse(dataJSON);
    var table = data.table;
    var rows = table.rows;
    rows.forEach(function(row) {
      var show = {
        place: row.c[0].v,
        date: row.c[1].v,
        time: row.c[2].f,
        price: row.c[3].v,
        link: row.c[4].v
      }
      shows.push(show)
    });
    callback(err, shows);
  }); 
}

app.get("/shows.json", function(req, res) {
  getShows(function(err, shows) {
    res.json(shows);
  });
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
  app: app,
  getShows: getShows
});