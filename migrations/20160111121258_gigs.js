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
    .then(() => {
      return knex.insert({
        title: 'Willie & Allie EP Release and Going Away Party', 
        day: '11', 
        month: 'JUN',
        location: 'Overland Bar and Grill, Oakland CA',
        time: '9:00pm Saturday'
      }).into('gigs')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('gigs').dropTable('emailListSignups')
}
