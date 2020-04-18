const app = require('../server.js');

const commentExample = require('./swagger/responses/commentExample');

swag({ app }, s => {
  s.group({ name: 'Comments', description: 'API for commenting on posts' }, () => {
    s.api('GET /posts/:id/comments', { parameters: require('./swagger/parameters/id') }, () => {
      const expects = { 'Content-Type': /json/ };
      s.test('Success', 200, {
        content: require('./swagger/responses/commentsResponse'),
        then: res => {
          expect(res.body).toEqual([expect.objectContaining({ text: expect.anything() })]);
        },
      });

      describe('when post does not exist', () => {
        const expects = { 'Content-Type': /json/ };
        s.test('Not Found', 404, {
          expects,
          params: { id: 'X' },
          example: require('./swagger/responses/notFound'),
        });
      });
    });

    s.api(
      'POST /posts/:id/comments',
      { parameters: require('./swagger/parameters/id'), requestBody: require('./swagger/parameters/createComment') },
      () => {
        const text = 'A new comment';
        const expects = { 'Content-Type': /json/ };
        s.test('Returns a comment', 201, {
          expects,
          params: { id: 'A1' },
          body: { text },
          example: commentExample,
          then: res => {
            expect(res.body).toEqual(expect.objectContaining({ text }));
          },
        });

        describe('when post does not exist', () => {
          const expects = { 'Content-Type': /json/ };
          s.test('Not Found', 404, {
            expects,
            params: { id: 'X' },
            example: require('./swagger/responses/notFound'),
          });
        });

        describe('when required params are missing', () => {
          s.test('Unprocessable Entity', 422, {
            expects,
            params: { id: 'A1' },
            body: {},
            example: require('./swagger/responses/unprocessableEntity'),
          });
        });
      },
    );
  });
});
