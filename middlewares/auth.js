const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotAuthentificatedError = require('../errors/not-authentificated-error');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new NotAuthentificatedError('Неправильный email или password');
    }

    const validTocken = token.replace('Bearer ', '');
    payload = jwt.verify(validTocken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if ((error.name === 'JsonWebTokenError')) {
      next(new UnauthorizedError('С токеном что-то не так'));
    }

    next(error);
  }

  req.user = payload;
  next();
};
