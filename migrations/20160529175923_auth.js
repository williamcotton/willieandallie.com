exports.up = (knex) => {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('uuid').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('user_credentials', (table) => {
      table.string('uuid').primary()
      table.string('type')
      table.string('hash')
      table.uuid('user_uuid')
      table.boolean('verifed').defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo()
      table.timestamp('verifed_at')
      table.foreign('user_uuid').references('users.uuid')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('user_credentials').dropTable('users')
}
