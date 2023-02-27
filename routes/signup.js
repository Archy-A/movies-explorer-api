const router = require('express').Router();
const signupController = require('../controllers/users');

router.post('/', signupController.createUser);

module.exports = router;
