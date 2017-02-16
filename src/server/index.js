require('node-jsx').install({extension: '.jsx'})

var nodeEnv = process.env.NODE_ENV
var defaultTitle = process.env.DEFAULT_TITLE
var port = process.env.PORT || 5000
var databaseUrl = process.env.DATABASE_URL

/*
  emailService
  ------------
  sendgrid
*/

var sendgrid = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

function sendMail ({to, from, subject, text}, callback) {
  var helper = require('sendgrid').mail
  var fromEmail = new helper.Email(from)
  var toEmail = new helper.Email(to)
  var content = new helper.Content('text/plain', text)
  var mail = new helper.Mail(fromEmail, subject, toEmail, content)
  var requestBody = mail.toJSON()
  var request = sendgrid.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sendgrid.API(request, callback)
}

var emailService = {
  sendVerificationUrl: function (options, callback) {
    var emailAddress = options.emailAddress
    var verificationUrl = options.verificationUrl
    var payload = {
      to: emailAddress,
      from: 'admin@willieandallie.com',
      subject: 'Email Verification',
      text: 'Thanks for signing up with the Willie & Allie website. \n\nPlease visit this link to complete your account creation: \n\n' + verificationUrl
    }
    if (nodeEnv === 'development') {
      console.log(payload)
    } else {
      sendMail(payload, callback)
    }
    callback(false, payload)
  },
  sendResetPasswordUrl: function (options, callback) {
    var emailAddress = options.emailAddress
    var resetPasswordUrl = options.resetPasswordUrl
    var payload = {
      to: emailAddress,
      from: 'admin@willieandallie.com',
      subject: 'Password Reset',
      text: 'We received a request to change your password with the Willie & Allie website. \n\nPlease visit this link to set your new password: \n\n' + resetPasswordUrl
    }
    if (nodeEnv === 'development') {
      console.log(payload)
    } else {
      sendMail(payload, callback)
    }
    callback(false, payload)
  }
}

/*
  userAuthenticationDataStore
  ---------------------------
*/

var userAuthenticationDataStore = require('../vendor/expect-postgres-user-authentication-data-store')({
  connection: databaseUrl
})

/*

  user authentication service
  ---------------------------

*/

var rsaPublicKeyPem = process.env.RSA_PUBLIC_KEY_PEM.replace(/\\n/g, '\n')
var rsaPrivateKeyPem = process.env.RSA_PRIVATE_KEY_PEM.replace(/\\n/g, '\n')

var userAuthenticationService = require('../vendor/expect-user-authentication-service')({
  emailService,
  verificationPath: '/verify/:token',
  resetPasswordPath: '/reset-password/:token',
  userAuthenticationDataStore,
  rsaPrivateKeyPem,
  rsaPublicKeyPem,
  userTokenExpiresIn: '7d'
})

/*
  grapqlService
  ------------
*/

var graphql = require('graphql')

var dataSchema = require('../schema')

var grapqlService = (query, context) => {
  return graphql.graphql(dataSchema, query, context)
}

var universalServerApp = require('./app')({port, defaultTitle, nodeEnv, userAuthenticationService, grapqlService})

universalServerApp.listen(port, function () {
  console.log('universalServerApp is running in %s mode on port %s', nodeEnv, port)
})
