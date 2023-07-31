const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/authorization-error');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthorizationError('Нет доступа'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-password');
  } catch (err) {
    next(new AuthorizationError(err));
  }
  req.user = payload;

  next();
  return null;
};
