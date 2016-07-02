const connection = process.env.DATABASE_URL

const knexConfig = {
  connection,
  client: 'pg',
  debug: true
}

knexConfig.migrations = {
  directory: __dirname + '/migrations'
}

module.exports = {
  development: knexConfig,
  production: knexConfig
}
