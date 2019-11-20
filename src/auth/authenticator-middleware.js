const { AuthError } = require('../lib/errors')

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (authHeader === 'Basic dXNlcjpwYXNzd29yZA==') next()
  else next(new AuthError('Invalid credentials'))
}
