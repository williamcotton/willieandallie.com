var bodyParser = require('body-parser')

module.exports = ({app, grapqlService}) => {
  app.post('/q', bodyParser.text({ type: 'application/graphql' }), ({body, user}, res) => {
    grapqlService(body, {user}).then((result) => res.status(200).json(result))
  })

  return (req, res, next) => {
    req.q = (query, callback) => {
      var user = req && req.user ? req.user : {}
      return new Promise((resolve, reject) => {
        grapqlService(query, {user}).then(result => {
          res.outgoingMessage = res.outgoingMessage ? res.outgoingMessage : {}
          res.outgoingMessage.qCache = res.outgoingMessage.qCache ? res.outgoingMessage.qCache : {}
          res.outgoingMessage.qCache[query] = result
          resolve(result)
        }, reject)
      })
    }
    next()
  }
}
