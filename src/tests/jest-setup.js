const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') })
const { sql, createPool } = require('slonik')

module.exports = async () => {
  await require('node-pg-migrate').default({
    direction: 'up',
    databaseUrl: process.env.DATABASE_URL,
    migrationsTable: 'pgmigrations',
    dir: path.resolve(process.cwd(), 'migrations')
  })
  const pool = createPool(process.env.DATABASE_URL)
  pool.connect(async client => {
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
  })
}
