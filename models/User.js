const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: {
        value: true,
        message: 'Поле name является обязательным',
      },
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    about: {
      type: String,
      required: {
        value: true,
        message: 'Поле about является обязательным',
      },
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    avatar: {
      type: String,
      required: {
        value: true,
        message: 'Поле avatar является обязательным',
      },
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
