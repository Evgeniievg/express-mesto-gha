const Card = require('../models/card');
const {
  CREATED_STATUS,
} = require('../utils/errors');
const NotFoundError = require('../utils/not-found-error');
const BadRequest = require('../utils/bad-request-error');
const ForbiddenError = require('../utils/forbidden-error');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  if (!name || !link) {
    next(new BadRequest('"Name" и "link" - обязательные поля'));
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка валидации карточки'));
      }
      next(err);
    });
};

module.exports.getCardData = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (req.user._id.toString() !== card.owner.toString()) {
        next(new ForbiddenError('Нет прав на удаление карточки'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.send({ data: removedCard }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка не найдена'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка не найдена'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка не найдена'));
      } else if (err instanceof NotFoundError) {
        next(err);
      } else {
        next(err);
      }
    });
};
