const Card = require('../models/card');
const {OK_STATUS, CREATED_STATUS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR} = require('../utils/errors')

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  if (!name || !link) {
    return res.status(BAD_REQUEST).send({ message: '"Name" и "link" - обязательные поля'});
  }
  Card.create({name, link, owner: req.user._id})
  .then(card => res.status(CREATED_STATUS).send({data: card}))
  .catch((err) => {
    if(err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации карточки'});
    } else {
      res.status(SERVER_ERROR).send({ message: `Ошибка на сервере: ${err}` });
    }
  })
}

module.exports.getCardData = (req, res) => {
  Card.find({})
  .then(card => res.status(OK_STATUS).send({ data: card }))
  .catch(err => res.status(SERVER_ERROR).send({ message: `На сервере произошла ошибка при получении данных карточки: ${err}` }));
}

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((err) =>
      res.status(SERVER_ERROR).send({ message: `Ошибка при удалении карточки: ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((err) => {
      if(err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка при добавлении лайка: ${err.message}`})
      }
    }
    );
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((err) =>
      res.status(SERVER_ERROR).send({ message: `Ошибка при удалении лайка: ${err.message}` })
    );
};
