const {GraphQLString, GraphQLInt, GraphQLBoolean} = require('graphql')
const {objectType, schemaFrom, listOf, notNull} = require('graphql-schema')

module.exports = ({databaseUrl}) => {
  const knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: databaseUrl
  })
  const bookshelf = require('bookshelf')(knex)

  console.log(databaseUrl)

  /* Gigs */

  const gigType = objectType('GigType')
    .field('id', notNull(GraphQLString), 'Gig id')
    .field('title', notNull(GraphQLString), 'Gig title')
    .field('day', notNull(GraphQLInt), 'Gig day of month')
    .field('month', notNull(GraphQLString), 'Gig 3-letter (JAN,FEB) name of month')
    .field('location', notNull(GraphQLString), 'Gig location')
    .field('time', notNull(GraphQLString), 'Gig start time')
    .field('extraInfo', GraphQLString, 'Gig extra information')
    .field('ticketUrl', GraphQLString, 'Gig URL for tickect sales')
    .end()

  const Gig = bookshelf.Model.extend({
    tableName: 'gigs'
  })

  /* EmailListSignups */

  const emailListSignupType = objectType('EmailListSignupType')
    .field('emailAddress', notNull(GraphQLString), 'Email Address')
    .end()

  const EmailListSignup = bookshelf.Model.extend({
    tableName: 'emailListSignups'
  })

  /* query */

  const queryType = objectType('QueryRoot')
    .field('upcomingGigs', listOf(gigType))
      .arg('includePast', GraphQLBoolean)
      .resolve(({user}, data, context) => {
        return Gig
          .query('orderBy', 'id', 'asc')
          .fetchAll()
          .then(gigs => gigs.toJSON())
      })
    .end()

  /* mutation */

  const mutationType = objectType('MutationRoot')
    .field('newEmailListSignup', emailListSignupType)
      .arg('emailAddress', notNull(GraphQLString))
      .resolve(({user}, {emailAddress}) => {
        let createdAt = new Date()
        return new EmailListSignup({emailAddress, createdAt})
          .save()
          .then(model => model.toJSON())
      })
    .field('newGig', emailListSignupType)
      .arg('title', notNull(GraphQLString))
      .arg('day', notNull(GraphQLInt))
      .arg('month', notNull(GraphQLString))
      .arg('location', notNull(GraphQLString))
      .arg('time', notNull(GraphQLString))
      .arg('extraInfo', GraphQLString)
      .arg('ticketUrl', GraphQLString)
      .resolve(({user}, gigData) => {
        return new Gig(gigData)
          .save()
          .then(model => model.toJSON())
      })
    .end()

  /* schema */

  return schemaFrom(queryType, mutationType)
}
