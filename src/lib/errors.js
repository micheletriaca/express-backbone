class RestError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class AuthError extends RestError {
  constructor (message) {
    super(401, message)
  }
}

module.exports = {
  RestError,
  AuthError
}
