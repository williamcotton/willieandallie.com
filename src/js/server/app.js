module.exports = function ({app, defaultTitle, dataSchema}) {
  var fs = require('fs')

  /*

    express app
    -----------

    expect-server-react-renderer
    ----------------------------

  */

  var express = require('express')
  if (!app) {
    app = express()
  }

  var expectReactRenderer = require('../lib/expect-server-react-renderer')

  // expect-server-template
  var template = fs.readFileSync(__dirname + '/../../ejs/index.ejs', 'utf8')

  // expect-server-react-renderer
  app.use(expectReactRenderer({
    RootComponent: require('../../jsx/root-component.jsx'),
    app,
    defaultTitle,
    rootDOMId: 'universal-app-container',
    template
  }))

  /*

    graphql
    -------

  */

  var graphql = require('graphql')
  var bodyParser = require('body-parser')

  app.post('/q', bodyParser.text({ type: 'application/graphql' }), ({body}, res) => {
    graphql.graphql(dataSchema, body).then((result) => res.status(200).json(result))
  })

  var q = (query, callback) => {
    return graphql.graphql(dataSchema, query)
  }

  /*

    universal app
    -------------
    server version

  */

  var universalServerApp = require('../../jsx/universal-app.jsx')({app, q})

  // static assets
  var publicDir = __dirname + '/../../../public'
  app.use(express.static(publicDir))

  // compression
  var compression = require('compression')
  app.use(compression())

  return universalServerApp
}
