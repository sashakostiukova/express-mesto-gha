const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(v);
        },
        message: 'Некорректный URL',
      },

    },
    email: {
      type: String,
      required: {
        value: true,
        message: 'Поле email является обязательным',
      },
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      minlength: [8, 'Минимальная длина - 8 символов'],
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
