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

  var RootComponent = require('../../jsx/root-component.jsx')
  var rootDOMId = 'universal-app-container'

  // adds req.user
  app.use(expectBrowserUserAuthentication({
    localStorage,
    app,
    expectReactRenderer,
    request
  }))

  // adds res.renderApp
  app.use(expectReactRenderer({
    RootComponent,
    app,
    rootDOMId,
    document,
    localStorage
  }))

  // adds req.q
  app.use((req, res, next) => {
    req.q = (query, callback) => {
      // cached on server-side to save an XHR lookup
      if (req.qCache && req.qCache[query]) {
        return new Promise((accept, reject) => {
          if (req.qCache[query].data) {
            accept(req.qCache[query])
          } else {
            reject('no data')
          }
        })
      }
      return new Promise((accept, reject) => {
        request({method: 'POST', url: '/q', body: query, headers: {'Content-Type': 'application/graphql', 'x-csrf-token': req.csrf}}, (err, res) => {
          if (err) { return reject(err) }
          accept(JSON.parse(res.body))
        })
      })
    }
    next()
  })

  /*

    universal app
    ------------
    browser version

  */

  var universalBrowserApp = require('../../jsx/universal-app.jsx')({app})

  return universalBrowserApp
}
