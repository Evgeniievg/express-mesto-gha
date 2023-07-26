const router = require('express').Router();
const {
  createCard, getCardData, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCardData);

router.delete('/:cardId', deleteCardById);

router.post('/', createCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
