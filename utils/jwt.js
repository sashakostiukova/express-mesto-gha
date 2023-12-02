const jwt = require('jsonwebtoken');
const { config } = require('../config');

module.exports.generateToken = (payload) => jwt.sign(payload, config.NODE_ENV ? config.JWT : 'dev_secret', {
  expiresIn: '7d',
});
