const express = require('express')
const router = express.Router()
const authenticator = require('../auth/authenticator-middleware')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

router
  .post('/example', authenticator, (req, res, next) => {
    sleep(500)
      .then(() => res.send({ ...req.body, name: req.body.name.toUpperCase() }))
      .catch(next)
  })
  .get('/example', (req, res) => res.send({ status: 'ok' }))

module.exports = router
