const express = require('express')
const router = express.Router()
const authenticator = require('../middlewares/authenticator')
const { QueryStreamMiddleware, QuerySyncMiddleware } = require('../middlewares/query')
const sqlQueries = require('../sql')
const { ForbiddenError } = require('../lib/errors')

router
  .use(authenticator)
  .get('/:parent/:id/:childs', (req, res, next) => {
    req.key = `/${req.params.parent}/:id/${req.params.childs}`
    req.myParams = req.params
    next()
  })
  .get('/:parent/:id', (req, res, next) => {
    req.key = `/${req.params.parent}/:id`
    req.myParams = req.params
    next()
  })
  .get('/:parent', (req, res, next) => {
    req.key = `/${req.params.parent}`
    req.myParams = req.params
    next()
  })
  .use((req, res, next) => {
    if (!sqlQueries[req.key]) return next(new ForbiddenError())
    const [query, streaming = false, postProcessFn] = sqlQueries[req.key](req)
    req.sql = { query, postProcessFn }
    if (streaming) QueryStreamMiddleware(req, res, next)
    else QuerySyncMiddleware(req, res, next)
  })

module.exports = router
