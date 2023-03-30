const Movie = require('../models/movie');
const Constants = require('../utils/constants');
const OwnerError = require('../errors/owner-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/user-id-err');

exports.getMovies = (req, res, next) => {
    Movie.find({ owner: req.user._id } )
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movies) => {
      console.log(' ==================== req ======================== ')
      console.log(' req.body = ', req.body)
      res.send(movies);
    })
    .catch((e) => {
      console.log(' ==================== req ======================== ')
      console.log(' req.body = ', req.body)
      // console.log(' err = ', e)
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

async function findMovie(id) {
  return await Movie.findOne({ _id: id });
}

exports.deleteMovie = (req, res, next) => {
    const owner = req.user._id;
    console.log('req.params.id = ', req.params.id)

    findMovie(req.params.id).then((moviedb) => {
      if (moviedb == null) {
        console.log('moviedb = ', moviedb)
        next(new NotFoundError(Constants.CARD_NOT_EXIST));
      }
      else if (moviedb.owner.valueOf() === owner) {
        Movie.findOneAndRemove({ _id: req.params.id }).then((movie) => {

        // Movie.findByIdAndRemove(req.params.movieId).then(() => {
        // res.send({message: `[ ${moviedb.nameRU} ] ${Constants.FILM_DELETED}`});

          res.send(movie)
        })
        .catch((e) => {
          if (e.name === 'CastError') {
            next(new BadRequestError(Constants.HTTP_BAD_REQUEST));
          } else {
            next(e);
          }
        });
      }
      else {
        next(new OwnerError(Constants.OWNER_WRONG));
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError(Constants.HTTP_BAD_REQUEST));
      } else {
        next(e);
      }
    });
};
