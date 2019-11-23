const express = require('express')
const morgan = require('morgan')
const exampleRouter = require('./routers/example')
const dataRouter = require('./routers/data')
const { RestError, ForbiddenError } = require('./lib/errors')

module.exports = express()
  .use(morgan('tiny'))
  .use(express.json())
  .use('/example', exampleRouter)
  .use('/data', dataRouter)
  .use('*', (req, res, next) => next(new ForbiddenError()))
  .use((err, req, res, next) => {
    if (!(err instanceof RestError)) err.status = 500
    if (err.status === 500) console.error(err.stack)
    res.status(err.status).send({ status: err.status, type: err.name, error: err.message })
  })
