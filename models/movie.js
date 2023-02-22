const mongoose = require('mongoose');
const Constants = require('../utils/constants');

const movieSchema = new mongoose.Schema({
// 12 fields
  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => Constants.REGEXPHTTP.test(v),
      message: 'Неправильный формат ссылки',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => Constants.REGEXPHTTP.test(v),
      message: 'Неправильный формат ссылки',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },

  trailerLink : {
    type: String,
    required: true,
    validate: {
      validator: (v) => Constants.REGEXPHTTP.test(v),
      message: 'Неправильный формат ссылки',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  movieId: {
    type: Number,
    required: true,
    unique : true, 
    dropDups: true
  },

});

module.exports = mongoose.model('movie', movieSchema);
