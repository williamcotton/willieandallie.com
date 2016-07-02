const {GraphQLString, GraphQLNonNull, GraphQLObjectType} = require('graphql')

const bookshelf = require('../bookshelf')

const Gig = bookshelf.model('Gig', {
  tableName: 'gigs'
})

const gigType = new GraphQLObjectType({
  name: 'GigType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    day: { type: new GraphQLNonNull(GraphQLString) },
    month: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    time: { type: new GraphQLNonNull(GraphQLString) },
    extraInfo: { type: GraphQLString },
    ticketUrl: { type: GraphQLString }
  })
})

module.exports = {Gig, gigType}
