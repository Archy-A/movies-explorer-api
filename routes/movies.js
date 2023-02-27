const router = require('express').Router();
const moviesController = require('../controllers/movies');
const validator = require('./validation');

router.get('/', moviesController.getMovies);

router.delete('/:id', validator.validateMovieDelete(), moviesController.deleteMovie);

router.post('/', validator.validateMoviePost(), moviesController.createMovie);

module.exports = router;
