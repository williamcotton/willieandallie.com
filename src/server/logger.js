module.exports = (req, res, next) => {
  var logs = []
  var log = console.log
  console.log = function () {
    logs.push(Array.prototype.slice.call(arguments))
  }
  res.on('finish', () => {
    log({
      logs,
      req: {
        path: req.path,
        hostname: req.hostname,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
        xhr: req.xhr,
        ip: req.ip,
        method: req.method,
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
        lang: req.headers['accept-language'],
        user: req.user,
        params: req.params,
        query: req.query
      },
      res: {
        statusCode: res.statusCode,
        qLog: res.qLog,
        renderAppLog: res.renderAppLog
      }
    })
    console.log = log
  })
  next()
}
