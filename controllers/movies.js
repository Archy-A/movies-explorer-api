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

async function findMovie(id) {
  return await Movie.findOne({ _id: id });
}

exports.deleteMovie = (req, res, next) => {
    const owner = req.user._id;
    findMovie(req.params.id ).then((moviedb) => {
      if (moviedb == null) {
        next(new NotFoundError(Constants.CARD_NOT_EXIST));
      }
      else if (moviedb.owner.valueOf() === owner) {
        Movie.findByIdAndRemove(req.params.id).then(() => {
          res.send({message: `[ ${moviedb.nameRU} ] ${Constants.FILM_DELETED}`});
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
