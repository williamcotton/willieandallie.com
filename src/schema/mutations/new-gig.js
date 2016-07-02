const {GraphQLString, GraphQLNonNull} = require('graphql')
const {Gig, gigType} = require('../models/gig')

module.exports = {
  type: gigType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    day: { type: new GraphQLNonNull(GraphQLString) },
    month: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    time: { type: new GraphQLNonNull(GraphQLString) },
    extraInfo: { type: GraphQLString },
    ticketUrl: { type: GraphQLString }
  },
  resolve: ({user}, gigData) => {
    return new Gig(gigData)
      .save()
      .then(model => model.toJSON())
  }
}
