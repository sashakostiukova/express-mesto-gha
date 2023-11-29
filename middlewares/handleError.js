const { ERROR_CODE_INTERNAL_SERVER_ERROR } = require('../utils/codes');

module.exports.handleError = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    return res
      .status(ERROR_CODE_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
  next();
};
