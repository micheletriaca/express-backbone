require('dotenv').config()
const PORT = process.env.EB_PORT || 3010
const server = require('./server')

const mainErrorHandler = err => console.error(err)
process.on('uncaughtException', mainErrorHandler)
process.on('unhandledRejection', mainErrorHandler)

server.listen(PORT, () => console.log(`up & running on http://localhost:${PORT}`))
