const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { config } = require('../config');

module.exports.auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedError('Неправильный email или password');
    }

    const validTocken = token.replace('Bearer ', '');
    payload = jwt.verify(validTocken, config.NODE_ENV ? config.JWT : 'dev_secret');
  } catch (error) {
    if ((error.name === 'JsonWebTokenError')) {
      next(new UnauthorizedError('С токеном что-то не так'));
    } else {
      next(error);
    }
  }

  req.user = payload;
  next();
};
