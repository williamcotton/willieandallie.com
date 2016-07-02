const {GraphQLString, GraphQLNonNull, GraphQLObjectType} = require('graphql')

const bookshelf = require('../bookshelf')

const EmailListSignup = bookshelf.model('EmailListSignup', {
  tableName: 'emailListSignups'
})

const emailListSignupType = new GraphQLObjectType({
  name: 'EmailListSignupType',
  fields: () => ({
    emailAddress: { type: new GraphQLNonNull(GraphQLString) }
  })
})

module.exports = {EmailListSignup, emailListSignupType}
