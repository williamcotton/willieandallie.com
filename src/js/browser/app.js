module.exports = function (options) {
  var request = options.request
  // var localStorage = options.localStorage

  /*

    browser-express app
    -------------------

    expect-browser-react-renderer
    -----------------------------

  */

  var express = require('browser-express')
  var app = options.app || express({
    interceptLinks: true,
    interceptFormSubmit: true,
    document: options.document,
    window: options.window
  })

  var expectReactRenderer = require('../lib/expect-browser-react-renderer')

  /*

    browser-express app middleware
    ------------------------------

    expect-browser-react-renderer middleware
    ----------------------------------------

  */

  // expect-browser-react-renderer
  app.use(expectReactRenderer({
    RootComponent: require('../../jsx/root-component.jsx'),
    app: app,
    rootDOMId: 'universal-app-container',
    document: options.document,
    localStorage: options.localStorage
  }))

  /*

    graphql
    -------

  */

  var q = (query, callback) => {
    return new Promise((accept, reject) => {
      request({method: 'POST', url: '/q', body: query, headers: {'Content-Type': 'application/graphql'}}, (err, res) => {
        if (err) { return reject(err) }
        accept(JSON.parse(res.body))
      })
    })
  }

  /*

    universal app
    ------------
    browser version

  */

  var universalBrowserApp = require('../../jsx/universal-app.jsx')({app, q})

  return universalBrowserApp
}
