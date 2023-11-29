const Card = require('../models/Card');
const {
  SUCCESS_CODE_OK,
  SUCCESS_CODE_CREATED,
  ERROR_CODE_BAD_REQUEST,
} = require('../utils/codes');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await new Card({ name, link, owner });

    return res.status(SUCCESS_CODE_CREATED).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.message = 'Ошибка валидации полей';
      error.statusCode = ERROR_CODE_BAD_REQUEST;
    }

    next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }

    const ownerId = card.owner._id.toString();
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Нет прав для совершения действия');
    }

    await card.deleteOne();
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан невалидный id'));
    }

    next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true });

    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан невалидный id'));
    }

    next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true });
    if (!card) {
      throw new NotFoundError('Карточка по id не найдена');
    }
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан невалидный id'));
    }

    next(error);
  }
};
