const {GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLSchema, GraphQLObjectType} = require('graphql')

module.exports = ({databaseUrl}) => {
  const knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: databaseUrl
  })
  const bookshelf = require('bookshelf')(knex)

  /* Gigs */
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
  const Gig = bookshelf.Model.extend({
    tableName: 'gigs'
  })

  /* EmailListSignups */
  const emailListSignupType = new GraphQLObjectType({
    name: 'EmailListSignupType',
    fields: () => ({
      emailAddress: { type: new GraphQLNonNull(GraphQLString) }
    })
  })
  const EmailListSignup = bookshelf.Model.extend({
    tableName: 'emailListSignups'
  })

  /* query */
  const queryType = new GraphQLObjectType({
    name: 'QueryRoot',
    fields: () => ({
      upcomingGigs: {
        type: new GraphQLList(gigType),
        args: {
          includePast: { type: GraphQLBoolean }
        },
        resolve ({user}, data) {
          return Gig
            .query('orderBy', 'id', 'asc')
            .fetchAll()
            .then(gigs => gigs.toJSON())
        }
      }
    })
  })

  /* mutation */
  const mutationType = new GraphQLObjectType({
    name: 'MutationRoot',
    fields: () => ({
      newEmailListSignup: {
        type: emailListSignupType,
        args: {
          emailAddress: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve ({user}, {emailAddress}) {
          let createdAt = new Date()
          return new EmailListSignup({emailAddress, createdAt})
            .save()
            .then(model => model.toJSON())
        }
      },
      newGig: {
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
        resolve ({user}, gigData) {
          return new Gig(gigData)
            .save()
            .then(model => model.toJSON())
        }
      }
    })
  })

  /* schema */
  return new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  })
}
