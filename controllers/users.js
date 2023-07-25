const User = require('../models/user');
const {OK_STATUS, CREATED_STATUS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR} = require('../utils/errors')

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  if (!name || !about || !avatar) {
    return res.status(BAD_REQUEST).send({ message: '"Name", "about" и "avatar" - обязательные поля'});
  }
  User.create({name, about, avatar})
  .then(user => res.status(CREATED_STATUS).send({data: user}))
  .catch(err => res.status(SERVER_ERROR).send({ message: `Произошла ошибка при создании пользователя: ${err}` }));
}

module.exports.getUserData = (req, res) => {
  User.find({})
  .then(user => res.status(OK_STATUS).send({ data: user }))
  .catch(err => res.status(SERVER_ERROR).send({ message: `Произошла ошибка при получении данных пользователя: ${err}`}));
}

module.exports.getUserDataId = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(SERVER_ERROR).send({ message: `Произошла ошибка при получении данных пользователя по id: ${err}` }));
}

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, {new: true, runValidators: true})
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(OK_STATUS).send({ data: user });
  })
  .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении данных пользователя' }));
}

module.exports.updateAvatar = (req, res) => {
  const avatar = req.body
  User.findByIdAndUpdate(req.user._id, avatar, {new: true, runValidators: true})
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(OK_STATUS).send({ data: user });
  })
  .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка при обновлении аватара' }));
}