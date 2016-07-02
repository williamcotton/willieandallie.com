const async = require('async')
const React = require('react')
const ReactDOM = require('react-dom')
const queryString = require('query-string')

var middlewareStack = []

var reactRenderApp = function (options) {
  var RootComponent = options.RootComponent ? React.createFactory(options.RootComponent) : React.createClass({propTypes: { content: React.PropTypes.element }, render: function () { return React.DOM.div({ className: 'universal-app-container' }, this.props.content) }})
  var app = options.app
  var formatTitle = options.formatTitle || function (defaultTitle, title) { return defaultTitle + (title ? ' - ' + title : '') }
  return function (req, res, next) {
    var Form = require('./form.jsx')(req, res)
    res.Form = Form
    res.navigate = function (path, query) {
      var pathname = path + '?' + queryString.stringify(query)
      app.navigate(pathname)
    }
    res.redirect = app.navigate
    res.send = function (data) {
      if (typeof data === 'object') {
        data = JSON.stringify(data)
      }
      options.document.getElementById(options.rootDOMId).innerHTML = data
    }
    res.renderApp = function (content, opts) {
      var rootProps = {}
      var contentProps = {}
      rootProps.navigate = res.navigate
      contentProps.navigate = res.navigate
      rootProps.submit = app.submit
      contentProps.submit = app.submit
      options.document.title = formatTitle(req.defaultTitle, opts ? opts.title : false)
      async.each(middlewareStack, function (middlewareFunction, callback) {
        middlewareFunction(req, res, contentProps, rootProps, callback)
      }, function () {
        contentProps.Form = Form
        var contentWithProps
        if (typeof content.type === 'string') {
          contentWithProps = content
        } else {
          contentWithProps = React.cloneElement(content, contentProps)
        }
        rootProps.content = contentWithProps
        rootProps.opts = opts
        ReactDOM.render(RootComponent(rootProps), options.document.getElementById(options.rootDOMId), function () {
          if (res.onComplete) {
            res.onComplete()
          }
        })
      })
    }
    next()
  }
}

reactRenderApp.use = function (middlewareFunction) {
  middlewareStack.push(middlewareFunction)
}

module.exports = reactRenderApp
