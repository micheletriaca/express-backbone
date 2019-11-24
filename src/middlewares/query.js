const { Pool } = require('pg')
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const _ = require('highland')
const once = require('lodash.once')
const { RestError, NotFoundError } = require('../lib/errors')

const pool = new Pool({
  connectionString: process.env.EB_DATABASE_URL,
  connectionTimeoutMillis: 15000,
  ssl: false
})

const QuerySyncMiddleware = async (req, res, next) => {
  let client
  try {
    const { query, postProcessFn = x => x.length === 1 ? x[0] : x } = req.sql
    client = await pool.connect()
    const { rows } = await client.query(query)
    client.release()
    if (!rows.length) return next(new NotFoundError())
    res.send(postProcessFn(rows))
  } catch (e) {
    if (client) client.release()
    next(new RestError(500, e.message))
  }
}

const QueryStreamMiddleware = async (req, res, next) => {
  let releaseOnce
  try {
    const { query, postProcessFn = x => x } = req.sql
    const client = await pool.connect()
    const source = client.query(new QueryStream(query.text, query.values))
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
      .map(postProcessFn)
      .pipe(JSONStream.stringify())
      .pipe(res)
  } catch (e) {
    if (releaseOnce) releaseOnce()
    next(new RestError(500, e.message))
  }
}

module.exports = {
  QuerySyncMiddleware,
  QueryStreamMiddleware
}
