const { celebrate, Joi } = require('celebrate');

const regexLink = /(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/;

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regexLink).required(),
    trailerLink: Joi.string().regex(regexLink).required(),
    thumbnail: Joi.string().regex(regexLink).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateMovie,
  validateDeleteMovie,
  validateUserUpdate,
};
