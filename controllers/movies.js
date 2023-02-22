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
      if (e.name === 'ValidationError') {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> tutttttt', e)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',)
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
        Movie.findByIdAndRemove(req.params.movieId).then((movies) => {
        res.send(movies);
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
