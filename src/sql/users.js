const { sql } = require('slonik')
const _ = require('lodash')

const generateWhere = (filters) => {
  const res = _(filters)
    .map((v, k) => v && sql`${sql.identifier([k])} ilike ${v.replace(/\*/g, '%')}`)
    .compact()
    .value()
  return sql.join([sql`TRUE`, ...res], sql` AND `)
}

module.exports = {
  '/users': ({ query }) => {
    const { size = 10, pageNumber = 1, email, name } = query
    return [sql`SELECT
      id,
      UPPER(name) as name
      FROM users
      WHERE ${generateWhere({ email, name })}
      LIMIT ${size} OFFSET ${(pageNumber - 1) * size}`,
    true
    ]
  },
  '/users/:id': ({ myParams }) => [sql`SELECT * FROM users WHERE id = ${myParams.id}`]
}
