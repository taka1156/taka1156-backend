const express = require('express');
const app = express();
const router = require('./routes/v1/');
require('dotenv').config();

app.use('/api/v1/', router);

// listen for requests :)
const PORT = process.env.PORT || 3000;

const listener = app.listen(PORT, () => {
  console.log('=============== Routers ===============')
  console.log(`[ http://localhost:${listener.address().port} ]`);
  console.log(`[ http://localhost:${listener.address().port}/api/v1/visiter.svg ]`);
  console.log(`[ http://localhost:${listener.address().port}/api/v1//date.svg ]`);
  console.log(`[ http://localhost:${listener.address().port}/api/v1//github.svg ]`);
  console.log('======================================')
});