const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movies = express.Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
} = require('../controllers/movies');

movies.get('/movies', getMovie);
movies.post('/movies', createMovie);

movies.delete('/movies/:movieId/delete-movies', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

// movies.put('/movies/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().hex().length(24).required(),
//   }),
// }), likeMovie);

// movies.delete('/movies/:movieId/likes', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().hex().length(24).required(),
//   }),
// }), dislikeMovie);

module.exports = { movies };
