const router = require('express').Router();
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const { ERROR_CODE_NOT_FOUND } = require('../utils/codes');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.all('*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = { router };
