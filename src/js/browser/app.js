module.exports = function ({app, request, localStorage, document, window}) {
  /*

    browser-express app
    -------------------

  */

  var express = require('browser-express')
  app = app || express({
    interceptLinks: true,
    interceptFormSubmit: true,
    document,
    window
  })

  /*

    browser-express app middleware
    ------------------------------

  */

  var expectReactRenderer = require('../lib/expect-browser-react-renderer')
  var expectBrowserUserAuthentication = require('../lib/expect-browser-user-authentication')
  var expectBrowserGraphQL = require('../lib/expect-browser-graphql')

  var RootComponent = require('../../jsx/root-component.jsx')
  var rootDOMId = 'universal-app-container'

  // adds req.user, req.login, req.logout, req.signup
  app.use(expectBrowserUserAuthentication({
    localStorage,
    app,
    expectReactRenderer,
    request
  }))

  // adds res.renderApp, res.Form
  app.use(expectReactRenderer({
    RootComponent,
    app,
    rootDOMId,
    document,
    localStorage
  }))

  // adds req.q
  app.use(expectBrowserGraphQL({
    app,
    request
  }))

  /*

    universal app
    ------------
    browser version

  */

  var universalBrowserApp = require('../../jsx/universal-app.jsx')({app})

  return universalBrowserApp
}
