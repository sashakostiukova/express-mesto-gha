const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const {
  SUCCESS_CODE_OK,
  SUCCESS_CODE_CREATED,
  ERROR_CODE_BAD_REQUEST,
  MONGO_DUPLACATE_ERROR_CODE,
} = require('../utils/codes');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NotAuthentificatedError = require('../errors/not-authentificated-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const user = await User.findById(idUser);
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.status(SUCCESS_CODE_OK).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан невалидный id'));
    }

    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    res
      .status(SUCCESS_CODE_OK)
      .send(
        {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        },
      );
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан невалидный id'));
    }

    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await new User({
      name, about, avatar, email, password: hash,
    });
    await newUser.save();
    return res.status(SUCCESS_CODE_CREATED).send({ newUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = ERROR_CODE_BAD_REQUEST;
    }

    if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    }

    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const id = req.user._id;
    const updatedUser = await User
      .findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true });

    return res.status(SUCCESS_CODE_OK).send(await updatedUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.message = 'Ошибка валидации полей';
      error.statusCode = ERROR_CODE_BAD_REQUEST;
    }

    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const id = req.user._id;
    const updatedUser = await User
      .findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });

    return res.status(SUCCESS_CODE_OK).send(await updatedUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.message = 'Ошибка валидации полей';
      error.statusCode = ERROR_CODE_BAD_REQUEST;
    }

    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAdmin = await User.findOne({ email })
      .select('+password')
      .orFail(() => new NotAuthentificatedError('Неправильный email или password'));

    const matched = await bcrypt.compare(String(password), userAdmin.password);
    if (!matched) {
      throw new NotAuthentificatedError('Неправильный email или password');
    }
    const token = generateToken({ _id: userAdmin._id });

    res.send({ token });
  } catch (error) {
    next(error);
  }
};
