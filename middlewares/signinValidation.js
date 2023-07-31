const { celebrate, Joi } = require('celebrate');

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .min(2)
      .max(30)
      .required()
      .email(),
    password: Joi.string().min(2).max(30).required(),
  }),
});
