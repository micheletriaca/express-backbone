module.exports = {
  '/posts': [
    'SELECT * FROM posts ORDER BY id ASC LIMIT $1 OFFSET $2',
    null,
    ({ query }) => {
      const { size = 10, pageNumber = 1 } = query
      return [size, (pageNumber - 1) * size]
    },
    true
  ],
  '/posts/:id': [
    'SELECT * FROM posts WHERE id = $1',
    null,
    req => [req.myParams.id]
  ]
}
