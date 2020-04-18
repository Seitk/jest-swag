const app = require('../server.js');

const postExample = require('./swagger/responses/postExample');

swag({ app }, s => {
  s.group({ name: 'Posts', description: 'Operations on posts' }, () => {
    s.api('GET /posts', { parameters: require('./swagger/parameters/paginate') }, () => {
      const expects = { 'Content-Type': /json/ };
      s.test('Success', 200, {
        expects,
        content: require('./swagger/responses/postsResponse'),
        then: res => {
          expect(res.body).toEqual({
            posts: [expect.objectContaining({ id: 'A0' })],
            total: 1,
          });
        },
      });
    });

    s.api('POST /posts', { requestBody: require('./swagger/parameters/createPost') }, () => {
      const expects = { 'Content-Type': /json/ };
      const title = 'Example 2';
      s.test('Creates a post', 201, {
        expects,
        body: { title },
        example: postExample,
        then: res => {
          expect(res.body).toEqual(expect.objectContaining({ title }));
        },
      });
    });

    s.api('GET /posts/:id', { parameters: require('./swagger/parameters/id') }, () => {
      const expects = { 'Content-Type': /json/ };
      const id = 'A3';
      s.test('Success', 200, {
        expects,
        params: { id },
        example: postExample,
        then: res => {
          expect(res.body).toEqual(expect.objectContaining({ id }));
        },
      });

      describe('when post does not exist', () => {
        s.test('Not Found', 404, {
          expects,
          params: { id: 'X' },
          example: postExample,
        });
      });
    });
  });
});
