const cardRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { cardIdSchema, cardSchema } = require('../utils/validationSchemas');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({ body: cardSchema }), createCard);
cardRouter.delete('/:cardId', celebrate({ params: cardIdSchema }), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({ params: cardIdSchema }), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({ params: cardIdSchema }), dislikeCard);

module.exports = { cardRouter };
