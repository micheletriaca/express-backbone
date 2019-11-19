require('dotenv').config()
const express = require('express')
const dbRouter = require('./routers/example-router')
const PORT = process.env.port || 3010

const mainErrorHandler = err => console.error(err)
process.on('uncaughtException', mainErrorHandler)
process.on('unhandledRejection', mainErrorHandler)

express()
  .use(express.json())
  .use('/data', dbRouter)
  .use('*', (req, res) => res.status(404).send({ status: 'NOT FOUND' }))
  .use((err, req, res, next) => res.status(500).send({ status: 'Not ok', error: err.message }))
  .listen(PORT, () => console.log(`up & running on http://localhost:${PORT}`))
