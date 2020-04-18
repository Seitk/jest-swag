module.exports = {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
          },
        },
        required: ['text'],
      },
    },
  },
};
