var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

module.exports = ({userAuthenticationDataStore, emailService, userTokenExpiresIn, verificationPath, resetPasswordPath, issuer, rsaPrivateKeyPem, rsaPublicKeyPem}) => {
  issuer = issuer || 'expect-user-auth'
  // issuer owns rsaPrivateKeyPem and rsaPublicKeyPem
  // openssl genrsa -out expect-user-authentication-service.pem 1024
  // openssl rsa -in expect-user-authentication-service.pem -pubout -out expect-user-authentication-service-public.pem
  var userAuthenticationService = {
    verificationPath: verificationPath,
    resetPasswordPath: resetPasswordPath,
    getToken: (options, callback) => {
      var credentials = options.credentials
      var password = credentials.password
      var audience = options.audience
      // if type: email
      // TODO: email verification, forgot password reset
      userAuthenticationDataStore.getUserCredentials({uuid: credentials.uuid, type: credentials.type}, (errHashLookup, existingCredentials) => {
        var hash = existingCredentials.hash
        var user = {
          uuid: existingCredentials.user_uuid,
          type: existingCredentials.type,
          verified: existingCredentials.verified
        }
        bcrypt.compare(password, hash, (errHashCompare, res) => {
          if (!errHashCompare && !errHashLookup && res) {
            jwt.sign(user, rsaPrivateKeyPem, {expiresIn: userTokenExpiresIn, issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, token) => {
              callback(err, user, token)
            })
          } else {
            callback(true, false, false)
          }
        })
      })
    // if type: facebook
    // TODO: check validity of token, check data store for user.uuid for facebook id
    },
    verifyToken: ({token, audience}, callback) => {
      jwt.verify(token, rsaPublicKeyPem, {issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, user) => {
        callback(err || !user, user)
      })
    },
    refreshToken: ({token, audience}, callback) => {
      if (!token || !audience || !rsaPublicKeyPem) {
        return callback(true, false)
      }
      jwt.verify(token, rsaPublicKeyPem, {issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, user) => {
        let {uuid, type, verified} = user || {}
        if (err) {
          return callback(err, false)
        }
        // TODO: it should only sign a new token if the old one is older than 1 hour - we don't need to sign tokens on every request!
        jwt.sign({uuid, type, verified}, rsaPrivateKeyPem, {expiresIn: userTokenExpiresIn, issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, token) => {
          callback(err, {uuid, type, verified}, token)
        })
      })
    },
    getCredentials: (options, callback) => {
      userAuthenticationDataStore.getUserCredentials(options, (err, {uuid, type, verified}) => {
        callback(err, {uuid, type, verified})
      })
    },
    createVerificationUrl: ({uuid, type, baseUrl}, callback) => {
      var audience = 'expect-verification-url'
      var credentials = {uuid, type}
      jwt.sign(credentials, rsaPrivateKeyPem, {expiresIn: userTokenExpiresIn, issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, token) => {
        var verificationUrl = baseUrl + verificationPath.replace(':token', token)
        callback(err, verificationUrl)
      })
    },
    sendVerificationEmail: ({emailAddress, baseUrl}, callback) => {
      userAuthenticationService.createVerificationUrl({
        baseUrl: baseUrl,
        uuid: emailAddress,
        type: 'email'
      }, (err, verificationUrl) => {
        if (err) return callback(err)
        emailService.sendVerificationUrl({
          emailAddress: emailAddress,
          verificationUrl: verificationUrl
        }, callback)
      })
    },
    verifyVerificationUrlToken: ({token}, callback) => {
      var audience = 'expect-verification-url'
      jwt.verify(token, rsaPublicKeyPem, {issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, credentials) => {
        if (err) return callback(err)
        userAuthenticationDataStore.setVerified({uuid: credentials.uuid}, (err, verified) => {
          if (err) return callback(err)
          credentials.verified = verified
          callback(false, credentials)
        })
      })
    },
    createResetPasswordUrl: ({uuid, type, baseUrl}, callback) => {
      var audience = 'expect-reset-password-url'
      var credentials = {uuid, type}
      jwt.sign(credentials, rsaPrivateKeyPem, {expiresIn: '10m', issuer: issuer, audience: audience, algorithm: 'RS256'}, function (err, token) {
        var resetPasswordUrl = baseUrl + resetPasswordPath.replace(':token', token)
        callback(err, resetPasswordUrl)
      })
    },
    sendResetPasswordEmail: ({emailAddress, baseUrl}, callback) => {
      userAuthenticationService.createResetPasswordUrl({
        baseUrl: baseUrl,
        uuid: emailAddress,
        type: 'email'
      }, (err, resetPasswordUrl) => {
        if (err) return callback(err)
        emailService.sendResetPasswordUrl({
          emailAddress: emailAddress,
          resetPasswordUrl: resetPasswordUrl
        }, callback)
      })
    },
    verifyResetPasswordUrlToken: ({token}, callback) => {
      var audience = 'expect-reset-password-url'
      jwt.verify(token, rsaPublicKeyPem, {issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, credentials) => {
        if (err && err.name === 'TokenExpiredError') {
          return callback('TOKEN_EXPIRED', false)
        }
        callback(false, credentials)
      })
    },
    setNewPassword: ({token, newPassword}, callback) => {
      var audience = 'expect-reset-password-url'
      jwt.verify(token, rsaPublicKeyPem, {issuer: issuer, audience: audience, algorithm: 'RS256'}, (err, credentials) => {
        if (err || !credentials) {
          return callback(err, false)
        }
        bcrypt.genSalt(10, (errGetSalt, salt) => {
          bcrypt.hash(newPassword, salt, (errGetHash, hash) => {
            if (err) return callback(err)
            userAuthenticationDataStore.setHash({uuid: credentials.uuid, hash: hash}, (err, hash) => {
              if (err) return callback(err)
              callback(false, credentials)
            })
          })
        })
      })
    },
    createUser: function ({uuid, type, password, baseUrl}, callback) {
      // if type: email
      var credentials = {uuid: uuid, type: type}
      userAuthenticationDataStore.getUserCredentials(credentials, (errHashLookup, existingCredentials) => {
        var hash = existingCredentials.hash
        if (hash) {
          return callback('UUID_FOR_TYPE_EXISTS')
        }
        bcrypt.genSalt(10, (errGetSalt, salt) => {
          bcrypt.hash(password, salt, (errGetHash, hash) => {
            credentials.hash = hash
            userAuthenticationDataStore.create(credentials, (err, newCredentials) => {
              var newUser = {
                uuid: newCredentials.user_uuid,
                type: newCredentials.type,
                verified: newCredentials.verified
              }
              if (newUser.type === 'email') {
                userAuthenticationService.sendVerificationEmail({
                  baseUrl: baseUrl,
                  emailAddress: newCredentials.uuid
                }, () => {
                })
              }
              if (err) {
                callback('CREATE_ERROR')
              } else {
                callback(false, newUser)
              }
            })
          })
        })
      })
    // if type: facebook
    // TODO: check validity of token, check to see if facebook id is there, if not, make a new user and associate it with the facebook id
    },
    // TODO: addNewCredentials - given a valid token and new credentials (phone number, facebook, twitter), create new user_credentials and associate with the token user
    destroyUser: (credentials, callback) => {
      userAuthenticationDataStore.getUserCredentials(credentials, (errHashLookup, existingCredentials) => {
        var hash = existingCredentials.hash
        bcrypt.compare(credentials.password, hash, (errHashCompare, res) => {
          if (!errHashCompare && !errHashLookup && res) {
            userAuthenticationDataStore.destroy(credentials, callback)
          } else {
            callback(true)
          }
        })
      })
    }
  // sign a POST action as a JWT token, authorizing the user - so perhaps middleware that checks req.session.userToken and req.method for POST and signs and notarizes the transaction
  // notarize a POST action with a valid JWT token, issuing another token with a timestamp
  }

  return userAuthenticationService
}
