exports.up = (knex) => {
  return knex.schema
    .createTable('gigs', (table) => {
      table.increments('id').primary()
      table.string('title')
      table.string('day')
      table.string('month')
      table.string('location')
      table.string('time')
      table.string('extraInfo')
      table.string('ticketUrl')
    })
    .createTable('emailListSignups', (table) => {
      table.increments('id').primary()
      table.string('emailAddress').notNull
      table.dateTime('createdAt').notNull()
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('gigs').dropTable('emailListSignups')
}
