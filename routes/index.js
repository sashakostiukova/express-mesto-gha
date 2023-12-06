const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userSignInSchema, userSignUpSchema } = require('../utils/validationSchemas');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', celebrate({ body: userSignInSchema }), login);
router.post('/signup', celebrate({ body: userSignUpSchema }), createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = { router };
