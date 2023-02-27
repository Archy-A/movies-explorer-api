const router = require('express').Router();
const unexistController = require('../controllers/unexist');

router.all('/*', unexistController.processUnexist);

module.exports = router;
