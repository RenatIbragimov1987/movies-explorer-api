const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundDataError = require('../errors/NotFoundDataError');
const DeleteDataError = require('../errors/DeleteDataError');

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
    const owner = req.userId;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
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
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    await movie.save();
    // await movie.populate('owner');
    res.status(201).send(await movie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка. Поля должны быть заполнены'));
      return;
    }
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movieById = await Movie.findById(movieId);
    if (!movieById) {
      next(new NotFoundDataError('Нет фильма с этим id'));
      return;
    }
    const movieOwner = movieById.owner.toString();
    if (movieOwner !== req.userId) {
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

// const likeMovie = async (req, res, next) => {
//   try {
//     const like = await Movie.findByIdAndUpdate(
//       req.params.movieId,
//       { $addToSet: { likes: req.userId } },
//       { new: true },
//     ).populate(['owner', 'likes']);
//     if (!like) {
//       next(new NotFoundDataError('Нет фильма с этим id'));
//       return;
//     }
//     res.status(200).send(like);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       next(new BadRequestError('Неверный id у фильма'));
//       return;
//     }
//     next(err);
//   }
// };

// const dislikeMovie = async (req, res, next) => {
//   try {
//     const like = await Movie.findByIdAndUpdate(
//       req.params.movieId,
//       { $pull: { likes: req.userId } },
//       { new: true },
//     ).populate(['owner', 'likes']);
//     if (!like) {
//       next(new NotFoundDataError('Нет фильма с этим id'));
//       return;
//     }
//     res.status(200).send(like);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       next(new BadRequestError('Неверный id у фильма'));
//       return;
//     }
//     next(err);
//   }
// };

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
};
