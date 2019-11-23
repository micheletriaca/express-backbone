class RestError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class AuthError extends RestError {
  constructor (message) { super(401, message) }
}

class NotFoundError extends RestError {
  constructor () { super(404, 'NOT FOUND') }
}

class ForbiddenError extends RestError {
  constructor () { super(403, 'FORBIDDEN') }
}

module.exports = {
  RestError,
  AuthError,
  NotFoundError,
  ForbiddenError
}
