const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.generateToken = (payload) => jwt.sign(payload, NODE_ENV ? JWT_SECRET : 'dev_secret', {
  expiresIn: '7d',
});
