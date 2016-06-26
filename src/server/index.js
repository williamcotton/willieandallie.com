require('node-jsx').install({extension: '.jsx'})

var fs = require('fs')

var nodeEnv = process.env.NODE_ENV
var defaultTitle = process.env.DEFAULT_TITLE
var port = process.env.PORT || 5000
var databaseUrl = process.env.DATABASE_URL

/*
  emailService
  ------------
  sendgrid
*/

var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)

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
      sendgrid.send(payload, callback)
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
      sendgrid.send(payload, callback)
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

  RSA_PRIVATE_KEY_PEM = awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' expect-user-authentication-service.pem
  RSA_PUBLIC_KEY_PEM = awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' expect-user-authentication-service-public.pem

*/

var rsaPublicKeyPem = process.env.RSA_PUBLIC_KEY_PEM ? process.env.RSA_PUBLIC_KEY_PEM.replace(/\\n/g,'\n') : fs.readFileSync(__dirname + '/../../expect-user-authentication-service-public.pem')
var rsaPrivateKeyPem = process.env.RSA_PRIVATE_KEY_PEM ? process.env.RSA_PRIVATE_KEY_PEM.replace(/\\n/g,'\n') : fs.readFileSync(__dirname + '/../../expect-user-authentication-service.pem')

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

var dataSchema = require('./data-schema')({databaseUrl})

var grapqlService = (query, context) => {
  return graphql.graphql(dataSchema, query, context)
}

var universalServerApp = require('./app')({
  port,
  defaultTitle,
  nodeEnv,
  userAuthenticationService,
  grapqlService
})

universalServerApp.listen(port, function () {
  console.log('universalServerApp is running in %s mode on port %s', nodeEnv, port)
})
