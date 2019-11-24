const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') })
const sql = require('sql-template-strings')
const { Client } = require('pg')

module.exports = async () => {
  await require('node-pg-migrate').default({
    direction: 'up',
    databaseUrl: process.env.EB_DATABASE_URL,
    migrationsTable: 'pgmigrations',
    dir: path.resolve(process.cwd(), 'migrations')
  })
  const client = new Client({
    connectionString: process.env.EB_DATABASE_URL
  })
  await client.connect()
  await client.query(sql`INSERT INTO users(name, email) VALUES
    (${'michele'}, ${'michele@example.com'}),
    (${'giorgio'}, ${'giorgio@example.com'}),
    (${'jack'}, ${'jack@example.com'}),
    (${'gio'}, ${'gio@example.com'})`)
  await client.query(sql`INSERT INTO posts(user_id, name) VALUES
    (${1}, ${'post di michele'}),
    (${1}, ${'post di michele 2'}),
    (${2}, ${'post di giorgio'}),
    (${2}, ${'post di giorgio 2'}),
    (${3}, ${'post di jack'})`)
  await client.end()
}
