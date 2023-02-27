const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const Constants = require('../utils/constants');
const UserPassError = require('../errors/user-pass-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UserPassError(Constants.USER_PASS_WRONG);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UserPassError(Constants.USER_PASS_WRONG);
          }
          return user;
        }).catch(next);
    }).catch(next);
};

module.exports = mongoose.model('user', userSchema);
