const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { config } = require('./config');
const { router } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// "start": "node app.js",
const app = express();

mongoose.connect(config.MONGO_URL);

app.use(json());
app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(handleError);

// app.listen(config.PORT);

module.exports = { app };
