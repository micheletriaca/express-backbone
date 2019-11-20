const request = require('supertest')
const app = require('../src/server')

describe('Get not existing endpoint', () => {
  it('should return 404', done => {
    request(app)
      .get('/random-endpoint')
      .expect(404)
      .expect(res => {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toEqual(404)
      })
      .end(done)
  })
})
