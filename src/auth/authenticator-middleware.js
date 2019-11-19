module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (authHeader === 'Basic dXNlcjpwYXNzd29yZA==') next()
  else next(Error('Invalid credentials'))
}
