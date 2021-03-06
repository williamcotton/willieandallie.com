const async = require('async')
const queryString = require('query-string')

var middlewareStack = []

const defaultTemplate = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title><%- title %></title>
  <link href="/build.css" rel="stylesheet" type="text/css">
  <script type="text/javascript">
    window.incomingMessage = <%- JSON.stringify(incomingMessage) %>
  </script>
</head>
<body>
  <div id="<%- rootDOMId %>"><%- HTML %></div>
  <% if (typeof(dontLoadJS) === 'boolean' && !dontLoadJS) { %><script src='/build.js' type='text/javascript' charset='utf-8'></script><% } %>
</body>
</html>`

var reactRenderApp = function (options) {
  var React = require('react')
  var ReactDOMServer = require('react-dom/server')
  var ejs = require('ejs')
  var template = options.template || defaultTemplate
  var RootComponent = options.RootComponent ? React.createFactory(options.RootComponent) : React.createClass({propTypes: { content: React.PropTypes.element }, render: function () { return React.DOM.div({ className: 'universal-app-container' }, this.props.content) }})
  var formatTitle = options.formatTitle || function (defaultTitle, title) { return defaultTitle + (title ? ' - ' + title : '') }
  return function reactRenderer (req, res, next) {
    var Form = require('./form.jsx')(req, res)
    res.Form = Form
    res.outgoingMessage = res.outgoingMessage ? res.outgoingMessage : {}
    res.outgoingMessage.defaultTitle = options.defaultTitle
    res.navigate = function (path, query) {
      var pathname = path + '?' + queryString.stringify(query)
      res.redirect(pathname)
    }
    res.renderApp = function (content, opts) {
      var rootProps = {}
      var contentProps = {}
      var title = formatTitle(options.defaultTitle, opts ? opts.title : false)
      rootProps.navigate = res.navigate
      contentProps.navigate = res.navigate
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
        var startTime = new Date()
        var HTML = ReactDOMServer.renderToStaticMarkup(RootComponent(rootProps))
        // if template was optional, or dynamic... a module could pass in the template...
        var renderedTemplate = ejs.render(template, { HTML: HTML, title: title, rootDOMId: options.rootDOMId, incomingMessage: res.outgoingMessage, dontLoadJS: false }, {})
        res.renderAppLog = {time: new Date() - startTime}
        res.send(renderedTemplate)
      })
    }
    next()
  }
}

reactRenderApp.use = function (middlewareFunction) {
  middlewareStack.push(middlewareFunction)
}

module.exports = reactRenderApp
