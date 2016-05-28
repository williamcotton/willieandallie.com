require('node-jsx').install({extension: '.jsx'})

var nodeEnv = process.env.NODE_ENV
var defaultTitle = process.env.DEFAULT_TITLE
var port = process.env.PORT || 5000

var dataSchema = require('./data-schema')

var universalServerApp = require('./app')({
  port,
  defaultTitle,
  nodeEnv,
  dataSchema
})

universalServerApp.listen(port, function () {
  console.log('universalServerApp is running in %s mode on port %s', nodeEnv, port)
})
