const express = require('express')
const router = express.Router()
const authenticator = require('../middlewares/authenticator')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

router
  .post('/example-post', authenticator, (req, res, next) => {
    sleep(10)
      .then(() => res.send({ ...req.body, name: req.body.name.toUpperCase() }))
      .catch(next)
  })
  .get('/example-get', (req, res) => res.send({ status: 'ok' }))

module.exports = router
