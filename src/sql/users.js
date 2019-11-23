module.exports = {
  '/users': [
    'SELECT id, UPPER(name) as name FROM users ORDER BY id ASC LIMIT $1 OFFSET $2',
    null, // rec => ({ ...rec, name: rec.name.toUpperCase() }),
    ({ query }) => {
      const { size = 10, pageNumber = 1 } = query
      return [size, (pageNumber - 1) * size]
    },
    true
  ],
  '/users/:id': [
    'SELECT * FROM users WHERE id = $1',
    null,
    req => [req.myParams.id]
  ]
}
