
module.exports = ({app, request}) => {
  return (req, res, next) => {
    req.q = (query, callback) => {
      // cached on server-side to save an XHR lookup
      if (req.qCache && req.qCache[query]) {
        return new Promise((resolve, reject) => {
          if (req.qCache[query].data) {
            resolve(req.qCache[query])
          } else {
            reject('no data')
          }
        })
      }
      return new Promise((resolve, reject) => {
        request({method: 'POST', url: '/q', body: query, headers: {'Content-Type': 'application/graphql', 'x-csrf-token': req.csrf}}, (err, res) => {
          if (err) { return reject(err) }
          resolve(JSON.parse(res.body))
        })
      })
    }
    next()
  }
}
