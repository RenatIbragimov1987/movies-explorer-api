const express = require('express');

const { validateMovie, validateDeleteMovie } = require('../validator/validator');

const movies = express.Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movies.get('/movies', getMovie);
movies.post('/movies', validateMovie, createMovie);
movies.delete('/movies/_id', validateDeleteMovie, deleteMovie);

module.exports = { movies };
