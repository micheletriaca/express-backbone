const { sql } = require('slonik')

module.exports = {
  '/posts': ({ query }) => {
    const { size = 10, pageNumber = 1 } = query
    return [sql`SELECT * FROM posts ORDER BY id ASC LIMIT ${size} OFFSET ${(pageNumber - 1) * size}`, true]
  },
  '/posts/:id': ({ myParams }) => [sql`SELECT * FROM posts WHERE id = ${myParams.id}`],
  '/users/:id/posts': ({ myParams }) => [sql`SELECT * from posts WHERE user_id = ${myParams.id}`, false, x => x]
}
