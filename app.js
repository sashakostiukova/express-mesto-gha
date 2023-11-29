const express = require('express');
require('dotenv').config();

const { json } = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { router } = require('./routes');
const { handleError } = require('./middlewares/handleError');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

app.use(json());
app.use(helmet());

app.use(router);
app.use(errors());
app.use(handleError);

app.listen(PORT);
