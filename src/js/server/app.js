module.exports = function ({app, defaultTitle, dataSchema, userAuthenticationService, grapqlService}) {
  /*

    express app
    -----------

  */

  var express = require('express')
  if (!app) {
    app = express()
  }

  /*

    browser-express app middleware
    ------------------------------

  */

  var bodyParser = require('body-parser')
  var expectReactRenderer = require('../lib/expect-server-react-renderer')
  var expectServerUserAuthentication = require('../lib/expect-server-user-authentication')

  var verificationSuccessPath = '/welcome'
  var newPasswordPath = '/new-password'
  var RootComponent = require('../../jsx/root-component.jsx')
  var rootDOMId = 'universal-app-container'

  // adds req.user
  app.use(expectServerUserAuthentication({
    app,
    userAuthenticationService,
    expectReactRenderer,
    verificationSuccessPath,
    newPasswordPath
  }))

  // adds res.renderApp
  app.use(expectReactRenderer({
    RootComponent,
    app,
    defaultTitle,
    rootDOMId
  }))

  // adds req.q
  app.post('/q', bodyParser.text({ type: 'application/graphql' }), ({body, user}, res) => {
    grapqlService(body, {user}).then((result) => res.status(200).json(result))
  })
  app.use((req, res, next) => {
    req.q = (query, callback) => {
      var user = req.user
      return grapqlService(query, {user})
    }
    next()
  })

  /*

    universal app
    -------------
    server version

  */

  var universalServerApp = require('../../jsx/universal-app.jsx')({app})

  // static assets
  var publicDir = __dirname + '/../../../public'
  app.use(express.static(publicDir))

  // compression
  var compression = require('compression')
  app.use(compression())

  return universalServerApp
}
