const sql = require('sql-template-strings')

module.exports = {
  '/users': ({ query }) => {
    const { size = 10, pageNumber = 1 } = query
    return [
      sql`SELECT
        id,
        UPPER(name) as name
        FROM users
        ORDER BY id ASC
        LIMIT ${size}
        OFFSET ${(pageNumber - 1) * size}`,
      true
    ]
  },
  '/users/:id': ({ myParams }) => [sql`SELECT * FROM users WHERE id = ${myParams.id}`]
}
