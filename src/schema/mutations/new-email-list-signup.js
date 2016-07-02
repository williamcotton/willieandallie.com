const {GraphQLString, GraphQLNonNull} = require('graphql')
const {EmailListSignup, emailListSignupType} = require('../models/email-list-signup')

module.exports = {
  type: emailListSignupType,
  args: {
    emailAddress: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: ({user}, {emailAddress}) => {
    let createdAt = new Date()
    return new EmailListSignup({emailAddress, createdAt})
      .save()
      .then(model => model.toJSON())
  }
}
