const BadRequestError = require('../errors/BadRequestError');
const NotFoundDataError = require('../errors/NotFoundDataError');
const DeleteDataError = require('../errors/DeleteDataError');
const Movie = require('../models/movie');

const getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).exec();
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user.id,
    });
    await movie.save();
    await movie.populate('owner');
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка. Поля должны быть заполнены'));
      return;
    }
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const movieById = await Movie.findById(_id);
    if (!movieById) {
      next(new NotFoundDataError('Нет фильма с этим id'));
      return;
    }
    if (!movieById.owner.equals(req.user.id._id)) {
      next(new DeleteDataError('Нет прав для удаления чужого фильма'));
      return;
    }
    const movieDelete = await Movie.findByIdAndDelete(movieById);
    res.status(200).send(movieDelete);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный id у фильма'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
