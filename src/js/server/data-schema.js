let {GraphQLString, GraphQLInt, GraphQLBoolean} = require('graphql')
let {objectType, schemaFrom, listOf, notNull} = require('graphql-schema')

var gigs = [
  {
    title: 'Willie & Allie EP Release and Going Away Party',
    day: 11,
    month: 'JUN',
    location: 'Overland, Oakland CA',
    time: '9:00pm, Saturday',
    extraInfo: 'Some Extra Info',
    ticketUrl: false
  }
]

const gigType = objectType('GigType')
  .field('title', notNull(GraphQLString), 'Gig title')
  .field('day', notNull(GraphQLInt), 'Gig day of month')
  .field('month', notNull(GraphQLString), 'Gig name of month')
  .field('location', notNull(GraphQLString), 'Gig location')
  .field('time', notNull(GraphQLString), 'Gig start time')
  .field('extraInfo', notNull(GraphQLString), 'Gig extra information')
  .field('ticketUrl', notNull(GraphQLString), 'Gig URL for tickect sales')
  .end()

const emailListSignupType = objectType('EmailListSignupType')
  .field('emailAddress', notNull(GraphQLString), 'Email Address')
  .end()

const queryType = objectType('QueryRoot')
  .field('gigs', listOf(gigType))
    .arg('includePast', GraphQLBoolean)
    .resolve((root, data, context) => {
      return gigs
    })
  .end()

const mutationType = objectType('MutationRoot')
  .field('newEmailListSignup', emailListSignupType)
    .arg('emailAddress', notNull(GraphQLString))
    .resolve((root, {emailAddress}, context) => {
      return {emailAddress}
    })
  .end()

module.exports = schemaFrom(queryType, mutationType)
