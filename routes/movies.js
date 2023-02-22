const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const moviesController = require('../controllers/movies');
const Constants = require('../utils/constants');

router.get('/', moviesController.getMovies);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), moviesController.deleteMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    description: Joi.string().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
    duration: Joi.number().required(),
    image: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
    year: Joi.number().integer().min(4).required(),
    thumbnail: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
    trailerLink: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
 //   owner: Joi.string().required().min(2).max(30),
    movieId: Joi.string().required().min(2).max(30)
  }),
}), moviesController.createMovie);

module.exports = router;
