const Movie = require('../models/movie');
const Constants = require('../utils/constants');
const OwnerError = require('../errors/owner-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/user-id-err');

exports.getMovies = (req, res, next) => {
    Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const { 
         nameRU,
         nameEN,
         description,
         director,
         country,
         duration,
         year,
         image,
         thumbnail,
         trailerLink,
         movieId
        } = req.body;

  Movie.create({ 
                nameRU,
                nameEN,
                description,
                director,
                country,
                duration,
                year,
                image,
                thumbnail,
                trailerLink,
                owner,
                movieId
              })
    .then((movies) => {
      res.send(movies);
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new BadRequestError(Constants.MOVIEID_EXIST));
      }
      if (e.name === 'ValidationError') {
        next(new BadRequestError(Constants.HTTP_BAD_REQUEST));
      } else {
        next(e);
      }
    });
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const moviedb = await Movie.findOne({ _id: req.params.id });
    const owner = req.user._id;
    if (moviedb == null) {
      next(new NotFoundError(Constants.CARD_NOT_EXIST));
    } else if (moviedb.owner.valueOf() === owner) {
        Movie.findByIdAndRemove(req.params.id).then(() => {
        res.send({message: `Фильм [ ${moviedb.nameRU} ] успешно удален!`});
      });
    } else {
      next(new OwnerError(Constants.OWNER_WRONG));
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(Constants.HTTP_BAD_REQUEST));
    } else {
      next(e);
    }
  }
};
