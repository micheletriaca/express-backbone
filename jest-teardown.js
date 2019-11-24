const path = require('path')

module.exports = done => {
  require('node-pg-migrate').default({
    direction: 'down',
    databaseUrl: process.env.EB_DATABASE_URL,
    migrationsTable: 'pgmigrations',
    dir: path.resolve(process.cwd(), 'migrations')
  }).then(done)
}
