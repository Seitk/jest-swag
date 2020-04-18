module.exports = {
  'application/json': {
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          postId: {
            type: 'integer',
          },
          text: {
            type: 'string',
          },
        },
      },
      example: [{ postId: 28, text: 'Good one.' }],
    },
  },
};
