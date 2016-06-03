module.exports = function ({app, defaultTitle, dataSchema, userAuthenticationService, grapqlService}) {
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
  var publicDir = path.join(__dirname, '/../../../public')
  app.use(express.static(publicDir))

  /*

    browser-express app middleware
    ------------------------------

  */

  var expectReactRenderer = require('../lib/expect-server-react-renderer')
  var expectServerUserAuthentication = require('../lib/expect-server-user-authentication')
  var expectServerGraphQL = require('../lib/expect-server-graphql')

  var verificationSuccessPath = '/'
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
  app.use(expectServerGraphQL({
    app,
    grapqlService
  }))

  /*

    universal app
    -------------
    server version

  */

  var universalServerApp = require('../../jsx/universal-app.jsx')({app})

  return universalServerApp
}
