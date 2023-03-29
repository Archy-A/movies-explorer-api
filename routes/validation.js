const { celebrate, Joi } = require('celebrate');
const Constants = require('../utils/constants');

exports.validateMoviePost = () => {
  return celebrate({
    body: Joi.object().keys({
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      description: Joi.string().required(),
      director: Joi.string().required(),
      country: Joi.string().required(),
      duration: Joi.number().required(),
      image: Joi.string().required().pattern(Constants.REGEXPHTTP),
      year: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(Constants.REGEXPHTTP),
      trailerLink: Joi.string().required().pattern(Constants.REGEXPHTTP2),
      externalId: Joi.number().required(),
      like: Joi.boolean().allow(null, '')
    })
  });
};

exports.validateMovieDelete = () => {
  return celebrate({
    params: Joi.object().keys({
      id: Joi.string()
      // id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    })
  });
};

exports.validateSignUP = () => {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });
};

exports.validateSignIN = () => {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });
};

exports.validateUserPatch = () => {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email()
    }),
  });
};