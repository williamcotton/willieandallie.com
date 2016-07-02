const {GraphQLSchema, GraphQLObjectType} = require('graphql')

const queryType = new GraphQLObjectType({
  name: 'QueryRoot',
  fields: () => ({
    upcomingGigs: require('./queries/upcoming-gigs')
  })
})

const mutationType = new GraphQLObjectType({
  name: 'MutationRoot',
  fields: () => ({
    newEmailListSignup: require('./mutations/new-email-list-signup'),
    newGig: require('./mutations/new-gig')
  })
})

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
