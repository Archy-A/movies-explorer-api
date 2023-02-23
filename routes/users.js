const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersController = require('../controllers/users');

router.get('/me', usersController.getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), usersController.updateUser);

module.exports = router;
