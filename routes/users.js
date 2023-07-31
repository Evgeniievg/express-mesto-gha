const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserData, getUserDataId, updateUser, updateAvatar, getCurrentUserData,
} = require('../controllers/users');

router.get('/', getUserData);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.get('/me', getCurrentUserData);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserDataId);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
}), updateAvatar);

module.exports = router;
