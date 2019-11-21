const { Pool } = require('pg')
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const _ = require('highland')
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

      _(client.query(new QueryStream(req.queryData.query, req.queryData.params || [])))
        .stopOnError(err => { releaseOnce(); next(err) })
        .on('end', releaseOnce)
        .map(req.postProcessFn || (x => x))
        .pipe(JSONStream.stringify())
        .pipe(res)
    } catch (e) {
      release()
      next(e)
    }
  })
}
