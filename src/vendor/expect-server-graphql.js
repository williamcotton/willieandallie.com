var bodyParser = require('body-parser')

module.exports = ({app, grapqlService}) => {
  app.post('/q', bodyParser.text({ type: 'application/graphql' }), (req, res) => {
    let body = req.body
    let user = req.user
    const query = body
    res.qLog = res.qLog || []
    var startTime = new Date()
    grapqlService(query, {user, req, res}).then((result) => {
      var time = new Date() - startTime
      res.qLog.push({query, time})
      return res.status(200).json(result)
    })
  })
  return (req, res, next) => {
    res.qLog = res.qLog || []
    req.q = (query, callback) => {
      var startTime = new Date()
      var user = req && req.user ? req.user : {}
      return new Promise((resolve, reject) => {
        grapqlService(query, {user, req, res}).then(result => {
          res.outgoingMessage = res.outgoingMessage ? res.outgoingMessage : {}
          res.outgoingMessage.qCache = res.outgoingMessage.qCache ? res.outgoingMessage.qCache : {}
          res.outgoingMessage.qCache[query] = result
          var time = new Date() - startTime
          res.qLog.push({query, time})
          resolve(result)
        }, reject)
      })
    }
    next()
  }
}
