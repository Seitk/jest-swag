const app = require('./server');
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));
app.listen(3000, () =>
  console.log(`Web service listening at http://localhost:3000\nCheck http://localhost:3000/api-docs for the example`),
);
