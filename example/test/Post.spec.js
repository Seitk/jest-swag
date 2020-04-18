const request = require('supertest');
const app = require('../server.js');

describe('GET /posts', () => {
  it('responds with json', done => {
    request(app)
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          posts: [expect.objectContaining({ id: 'A0' })],
          total: 1,
        });
        done();
      });
  });
});

describe('POST /posts', () => {
  it('responds with json', done => {
    const title = 'Example 2';
    request(app)
      .post('/posts')
      .send({ title })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({ title }));
        done();
      });
  });
});

describe('GET /posts/:id', () => {
  it('responds with json', done => {
    const id = 'A3';
    request(app)
      .get(`/posts/${id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({ id }));
        done();
      });
  });

  describe('when post does not exist', () => {
    it('responds with 404', done => {
      const id = 'X';
      request(app)
        .get(`/posts/${id}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body.code).toEqual('NOT_FOUND');
          done();
        });
    });
  });
});
