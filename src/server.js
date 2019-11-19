const express = require('express')
const exampleRouter = require('./routers/example-router')

module.exports = express()
  .use(express.json())
  .use('/example', exampleRouter)
  .use('*', (req, res) => res.status(404).send({ status: 'NOT FOUND' }))
  .use((err, req, res, next) => res.status(500).send({ status: 'Not ok', error: err.message }))
