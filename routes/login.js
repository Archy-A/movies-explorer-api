const router = require('express').Router();
const loginController = require('../controllers/users');

router.post('/', loginController.login);

module.exports = router;
