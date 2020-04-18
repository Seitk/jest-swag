module.exports = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
        required: ['name'],
      },
    },
  },
};
