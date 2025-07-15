const express = require('express');
const app = express();
const errorHandler = require('./errorHandler');

// Other middleware and routes

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});