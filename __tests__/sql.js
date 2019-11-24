const app = require('../src/server')
const request = require('supertest')

describe('Db access', () => {
  it('should fetch the user list', done => {
    request(app)
      .get('/data/users')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(4)
      })
      .end(done)
  })

  it('should return forbidden', done => {
    request(app)
      .get('/data/not-existent-path')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(403, done)
  })

  it('should return 404 because the resource does not exists', done => {
    request(app)
      .get('/data/users/222')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(404, done)
  })

  it('should return a single user', done => {
    request(app)
      .get('/data/users/1')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200, done)
  })

  it('should return empty array', done => {
    request(app)
      .get('/data/users/222/posts')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(0)
      })
      .end(done)
  })

  it('should return 5 posts', done => {
    request(app)
      .get('/data/posts')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(5)
      })
      .end(done)
  })

  it('should return single post', done => {
    request(app)
      .get('/data/posts/1')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchSnapshot()
      })
      .end(done)
  })

  it('should fetch a complicated payload', done => {
    request(app)
      .get('/data/user-with-posts/3')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchSnapshot()
      })
      .end(done)
  })

  it('should fetch a complicated payload with empty posts', done => {
    request(app)
      .get('/data/user-with-posts/4')
      .auth(process.env.EB_USERNAME, process.env.EB_PASSWORD)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchSnapshot()
      })
      .end(done)
  })
})
