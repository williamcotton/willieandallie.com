const {GraphQLList, GraphQLBoolean} = require('graphql')
const {Gig, gigType} = require('../models/gig')

module.exports = {
  type: new GraphQLList(gigType),
  args: {
    includePast: { type: GraphQLBoolean }
  },
  resolve: ({user}, data) => {
    return Gig
      .query('orderBy', 'id', 'asc')
      .where('published', true)
      .fetchAll()
      .then(gigs => gigs.toJSON())
  }
}
