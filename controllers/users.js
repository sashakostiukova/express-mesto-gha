const User = require('../models/User');

const SUCCESS_CODE_OK = 200;
const SUCCESS_CODE_CREATED = 201;
const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(ERROR_CODE_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне севера' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = await User.findById(idUser);
    if (!user) {
      throw new Error('NotFound');
    }
    res.status(SUCCESS_CODE_OK).send(user);
  } catch (error) {
    console.log(error);
    if (error.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по id не найден' });
    }

    if (error.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан не валидный id' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, about, avatar } = req.body;
    const newUser = await new User({ name, about, avatar });

    return res.status(SUCCESS_CODE_CREATED).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(ERROR_CODE_BAD_REQUEST)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    console.log(error.code);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, about } = req.body;
    const id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(id, { name, about }, { new: true });

    return res.status(SUCCESS_CODE_CREATED).send(await updatedUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(ERROR_CODE_BAD_REQUEST)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    console.log(error.code);
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    console.log(req.body);
    const { avatar } = req.body;
    const id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(id, { avatar }, { new: true });

    return res.status(SUCCESS_CODE_CREATED).send(await updatedUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') { // неработает валидация. запрос не проходит, но и не ловит ошибки
      return res
        .status(ERROR_CODE_BAD_REQUEST)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    console.log(error.code);
  }
};

// module.exports.getUserById = async (req, res) => {
//   try {
//     const { idUser } = req.params;
//     const user = await User.findById(idUser);
//     if (!user) {
//       throw new Error('NotFound');
//     }
//     res.status(SUCCESS_CODE_OK).send(user);
//   } catch (error) {
//     console.log(error);
//     if (error.message === 'NotFound') {
//       return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по id не найден' });
//     }

//     if (error.name === 'CastError') {
//       return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан не валидный id' });
//     }

//     return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR)
// .send({ message: 'Ошибка на стороне сервера' });
//   }
// };
