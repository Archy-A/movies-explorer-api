const router = require('express').Router();
const usersController = require('../controllers/users');
const validator = require('./validation');

router.get('/me', usersController.getMe);

router.patch('/me', validator.validateUserPatch(), usersController.updateUser);

module.exports = router;
