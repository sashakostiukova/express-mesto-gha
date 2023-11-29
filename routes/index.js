const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  login,
  createUser,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = { router };
