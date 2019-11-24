const { AuthError } = require('../lib/errors')
const AUTH_VALUE = 'Basic ' + Buffer
  .from(`${process.env.EB_USERNAME}:${process.env.EB_PASSWORD}`)
  .toString('base64')

module.exports = (req, res, next) => {
  if (req.header('Authorization') === AUTH_VALUE) next()
  else next(new AuthError('Invalid credentials'))
}
