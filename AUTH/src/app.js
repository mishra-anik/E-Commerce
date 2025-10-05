
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth' , authRoute);

module.exports = app;
