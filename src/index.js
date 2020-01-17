require('dotenv').config()
const path = require('path')
const PORT = process.env.PORT || 3010
const server = require('./server')

const mainErrorHandler = err => console.error(err)
process.on('uncaughtException', mainErrorHandler)
process.on('unhandledRejection', mainErrorHandler)

;(async () => {
  if (process.env.INIT_DB_AT_STARTUP === 'true') {
    await require('node-pg-migrate').default({
      direction: 'up',
      databaseUrl: process.env.DATABASE_URL,
      migrationsTable: 'pgmigrations',
      dir: path.resolve(process.cwd(), 'migrations')
    })
  }
  server.listen(PORT, () => console.log(`up & running on http://localhost:${PORT}`))
})()
