const User = require('../models/user');
const {
  OK_STATUS, CREATED_STATUS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_STATUS).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.getUserData = (req, res) => {
  User.find({})
    .then((user) => res.status(OK_STATUS).send({ data: user }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка при получении данных пользователя' }));
};

module.exports.getUserDataId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователя с таким Id не существует' });
      }
      return res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка при поиске пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(OK_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении данных пользователя' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(OK_STATUS).send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении аватара' }));
};
