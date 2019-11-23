const { Pool } = require('pg')
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const _ = require('highland')
const once = require('lodash.once')
const { RestError } = require('../lib/errors')

const pool = new Pool({
  connectionString: process.env.EB_DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: false
})

const QuerySyncMiddleware = async (req, res, next) => {
  let client
  try {
    const { query, params = [] } = (req.queryData || {})
    if (!query) return next(new RestError(400, 'Invalid query data'))
    client = await pool.connect()
    const { rows } = await client.query(query, params)
    client.release()
    if (rows.length === 0) return next(new RestError(404, 'NOT FOUND'))
    const postProcessFn = req.postProcessFn || (x => x)
    res.send(rows.length === 1 ? postProcessFn(rows[0]) : rows.map(postProcessFn))
  } catch (e) {
    if (client) client.release()
    next(e)
  }
}

const QueryStreamMiddleware = async (req, res, next) => {
  let releaseOnce
  try {
    const { query, params = [] } = (req.queryData || {})
    if (!query) return next(new RestError(400, 'Invalid query data'))
    const client = await pool.connect()
    const source = client.query(new QueryStream(query, params))
    releaseOnce = once(client.release)
    res.setHeader('Content-Type', 'application/json')
    req.on('close', releaseOnce)
    source.on('end', releaseOnce)
    source.on('error', e => {
      releaseOnce(e)
      next(new RestError(500, e.message))
    })
    _(source)
      .on('end', releaseOnce)
      .map(req.postProcessFn || (x => x))
      .pipe(JSONStream.stringify())
      .pipe(res)
  } catch (e) {
    if (releaseOnce) releaseOnce()
    next(e)
  }
}

module.exports = {
  QuerySyncMiddleware,
  QueryStreamMiddleware
}
