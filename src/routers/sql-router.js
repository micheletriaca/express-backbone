const express = require('express')
const router = express.Router()
const authenticator = require('../auth/authenticator-middleware')
const querier = require('../query/querier-middleware')
const sqlQueries = require('./sql')

router
  .use(authenticator)
  .get('/:parent/:id/:childs', (req, res, next) => {
    req.key = '/' + req.params.parent + '/:id/' + req.params.childs
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
    if (!req.key || !sqlQueries[req.key]) return res.status(404).send('NOT FOUND')
    const data = sqlQueries[req.key]
    req.queryData = { query: data[0], params: data[2] ? data[2](req) : [] }
    req.postProcessFn = data[1]
    console.log(req.queryData)
    next()
  })
  .use(querier)

module.exports = router
