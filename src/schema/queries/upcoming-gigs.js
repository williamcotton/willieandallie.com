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
      .fetchAll()
      .then(gigs => gigs.toJSON())
  }
}
