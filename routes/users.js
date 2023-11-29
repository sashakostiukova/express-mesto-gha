const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUser);

userRouter.get('/:idUser', celebrate({
  params: Joi.object().keys({
    idUser: Joi.string().alphanum().length(24),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = { userRouter };
