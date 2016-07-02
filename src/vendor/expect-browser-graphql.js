module.exports = ({app, request}) => {
  return (req, res, next) => {
    res.qLog = res.qLog || []
    var startTime = new Date()
    req.q = (query, callback) => {
      // cached on server-side to save an XHR lookup
      if (req.qCache && req.qCache[query]) {
        return new Promise((resolve, reject) => {
          if (req.qCache[query].data) {
            var time = new Date() - startTime
            res.qLog.push({query, time, cached: true})
            resolve(req.qCache[query])
          } else {
            reject('no data')
          }
        })
      }
      return new Promise((resolve, reject) => {
        request({method: 'POST', url: '/q', body: query, headers: {'Content-Type': 'application/graphql', 'x-csrf-token': req.csrf}}, (err, resp) => {
          if (err) { return reject(err) }
          var result = JSON.parse(resp.body)
          window.incomingMessage = window.incomingMessage ? window.incomingMessage : {}
          window.incomingMessage.qCache = window.incomingMessage.qCache ? window.incomingMessage.qCache : {}
          window.incomingMessage.qCache[query] = result
          var time = new Date() - startTime
          res.qLog.push({query, time})
          resolve(result)
        })
      })
    }
    next()
  }
}
