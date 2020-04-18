module.exports = {
  'application/json': {
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          title: {
            type: 'string',
          },
        },
      },
      example: [{ id: 28, ttle: 'example' }],
    },
  },
};
