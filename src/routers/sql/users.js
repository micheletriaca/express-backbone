module.exports = {
  '/users': [
    'SELECT * FROM users ORDER BY id ASC',
    req => ({ ...req, name: req.name.toUpperCase() })
  ],
  '/users/:id': [
    'SELECT * FROM users WHERE id = $1 ORDER BY id ASC',
    null,
    req => [req.myParams.id]
  ]
}
