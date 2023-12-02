const userRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userIdSchema, userUpdateSchema, avatarUpdateSchema } = require('../utils/validationSchemas');
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:idUser', celebrate({ params: userIdSchema }), getUserById);
userRouter.patch('/me', celebrate({ body: userUpdateSchema }), updateUser);
userRouter.patch('/me/avatar', celebrate({ body: avatarUpdateSchema }), updateAvatar);

module.exports = { userRouter };
