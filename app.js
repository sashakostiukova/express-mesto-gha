const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const { router } = require('./routes');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

// временное решение авторизации:
app.use((req, res, next) => {
  req.user = {
    _id: '6550ece5aa122d28d739a73e',
  };

  next();
});

app.use(json());

app.use(router);

app.listen(PORT);
