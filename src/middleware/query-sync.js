const { Pool } = require('pg')
const __ = require('lodash')
const { RestError } = require('../lib/errors')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: true
})

module.exports = (req, res, next) => {
  if (!req.queryData || !req.queryData.query) return next(new RestError(400, 'Invalid query data'))
  pool.connect((err, client, release) => {
    if (err) return next(err)

    res.status(200)
    res.setHeader('Content-Type', 'application/json')

    try {
      const releaseOnce = __.once(release)
      req.on('close', err => {
        if (err) console.error(err)
        releaseOnce()
      })

      client.query(req.queryData.query, req.queryData.params || [], (err, result) => {
        releaseOnce()
        if (err) next(err)
        const postProcessFn = req.postProcessFn || (x => x)
        if (result.rows.length === 0) return next(new RestError(404, 'NOT FOUND'))
        res.send(result.rows.length === 1 ? postProcessFn(result.rows[0]) : result.rows.map(postProcessFn))
      })
    } catch (e) {
      release()
      next(e)
    }
  })
}
