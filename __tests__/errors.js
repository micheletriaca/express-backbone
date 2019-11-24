const app = require('../src/server')
const request = require('supertest')

describe('Test non rest errors', () => {
  it('should log error with full stack trace', done => {
    request(app)
      .post('/example/example-post')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .send({ wrongfield: 'john' })
      .expect(500)
      .expect(res => {
        expect(res.body.error).toBe("Cannot read property 'toUpperCase' of undefined")
      })
      .end(done)
  })
})
