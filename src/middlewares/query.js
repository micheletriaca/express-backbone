const JSONStream = require('JSONStream')
const _ = require('highland')
const { RestError, NotFoundError } = require('../lib/errors')
const { createPool, sql } = require('slonik')
const { createFieldNameTransformationInterceptor } = require('slonik-interceptor-field-name-transformation')
const { createQueryLoggingInterceptor } = require('slonik-interceptor-query-logging')

const interceptors = [
  createQueryLoggingInterceptor(),
  createFieldNameTransformationInterceptor({
    format: 'CAMEL_CASE'
  })
]

const pool = createPool(process.env.DATABASE_URL, {
  minimumPoolSize: 5,
  idleTimeout: 10000000,
  interceptors
})

pool.query(sql`SELECT NOW()`) // Warm the db connection

const QuerySyncMiddleware = async (req, res, next) => {
  try {
    const { query, postProcessFn = x => x.length === 1 ? x[0] : x } = req.sql
    const { rows } = await pool.query(query)
    if (!rows.length) return next(new NotFoundError())
    res.send(postProcessFn(rows))
  } catch (e) {
    next(new RestError(500, e.message))
  }
}

const QueryStreamMiddleware = async (req, res, next) => {
  const jsonStringify = JSONStream.stringify()
  try {
    const { query, postProcessFn = x => x } = req.sql
    await pool.stream(query, source => {
      res.setHeader('Content-Type', 'application/json')
      req.on('close', () => source.end())
      _(source)
        .map(x => x.row)
        .map(postProcessFn)
        .pipe(jsonStringify)
        .pipe(res)
    })
  } catch (e) {
    jsonStringify.pause()
    next(new RestError(500, e.message))
  }
}

module.exports = {
  QuerySyncMiddleware,
  QueryStreamMiddleware
}
