const express = require('express');
const route = require('./routes/product.routes');  

const app = express();

app.use(express.json());

app.use('/api/products' , route);

module.exports = app;