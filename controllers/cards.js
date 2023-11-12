const Card = require('../models/Card');

const SUCCESS_CODE_OK = 200;
const SUCCESS_CODE_CREATED = 201;
const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(ERROR_CODE_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне севера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await new Card({ name, link, owner });

    return res.status(SUCCESS_CODE_CREATED).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(ERROR_CODE_BAD_REQUEST)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    return res
      .status(error.code)
      .send(error.message);
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      throw new Error('NotFound');
    }
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка по id не найдена' });
    }

    if (error.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан не валидный id' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true });

    if (!card) {
      throw new Error('NotFound');
    }
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка по id не найдена' });
    }

    if (error.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан не валидный id' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true });
    if (!card) {
      throw new Error('NotFound');
    }
    res.status(SUCCESS_CODE_OK).send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка по id не найдена' });
    }

    if (error.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан не валидный id' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};
