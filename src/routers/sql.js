const express = require('express')
const router = express.Router()
const authenticator = require('../middleware/authenticator')
const queryStream = require('../middleware/query-stream')
const querySync = require('../middleware/query-sync')
const sqlQueries = require('../sql')
const { RestError } = require('../lib/errors')

router
  .use(authenticator)
  .get('/:parent/:id/:children', (req, res, next) => {
    req.key = '/' + req.params.parent + '/:id/' + req.params.children
    req.myParams = req.params
    next()
  })
  .get('/:parent/:id', (req, res, next) => {
    req.key = '/' + req.params.parent + '/:id'
    req.myParams = req.params
    next()
  })
  .get('/:parent', (req, res, next) => {
    req.key = '/' + req.params.parent
    req.myParams = req.params
    next()
  })
  .use((req, res, next) => {
    if (!req.key || !sqlQueries[req.key]) return next(new RestError(403, 'Forbidden'))
    const data = sqlQueries[req.key]
    req.queryData = { query: data[0], params: data[2] ? data[2](req) : [] }
    req.postProcessFn = data[1]
    req.streaming = data[3] || false
    next()
  })
  .use((req, res, next) => {
    if (req.streaming) return queryStream(req, res, next)
    else return querySync(req, res, next)
  })

module.exports = router
