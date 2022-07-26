const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Неверный формат записи ссылки постера',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Неверный формат записи ссылки трейлера',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Неверный формат записи ссылки миниатюрного постера к фильму',
    },
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'user',
  //   required: true,
  // },
  movieId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
