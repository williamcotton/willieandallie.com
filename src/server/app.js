module.exports = function ({app, defaultTitle, userAuthenticationService, grapqlService}) {
  /*

    express app
    -----------

  */

  var express = require('express')
  if (!app) {
    app = express()
  }

  // compression
  var compression = require('compression')
  app.use(compression())

  // static assets
  var path = require('path')
  var publicDir = path.join(__dirname, '/../../public')
  app.use(express.static(publicDir))

  /*

    browser-express app middleware
    ------------------------------

  */

  var expectReactRenderer = require('../vendor/expect-server-react-renderer')
  var expectServerUserAuthentication = require('../vendor/expect-server-user-authentication')
  var expectServerGraphQL = require('../vendor/expect-server-graphql')
  var logger = require('./logger')

  var verificationSuccessPath = '/'
  var newPasswordPath = '/new-password'
  var RootComponent = require('../components/root-component.jsx')
  var rootDOMId = 'universal-app-container'

  app.use(logger)

  // adds req.user
  app.use(expectServerUserAuthentication({app, userAuthenticationService, expectReactRenderer, verificationSuccessPath, newPasswordPath}))

  // adds res.renderApp
  app.use(expectReactRenderer({app, RootComponent, defaultTitle, rootDOMId}))

  // adds req.q
  app.use(expectServerGraphQL({app, grapqlService}))

  /*

    universal app
    -------------
    server version

  */

  var universalServerApp = require('../universal-app.jsx')({app})

  return universalServerApp
}
