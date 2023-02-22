const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Constants = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/user-id-err');
const UserExistError = require('../errors/user-exist-err');

exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      } else {
        throw new NotFoundError(Constants.USER_NOT_FOUND);
      }
    })
    .catch(next);
};

exports.createUser = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    })
      .then((userdata) => res.send({
        name: userdata.name,
        email: userdata.email,
        _id: userdata._id,
      })))
    .catch((e) => {
      if (e.code === 11000) {
        next(new UserExistError(Constants.USER_EXIST));
      } else if (e.name === 'CastError') {
        next(new BadRequestError(Constants.USER_ID_WRONG));
      } else {
        next(e);
      }
    });
  return null;
};

exports.updateUser = (req, res, next) => {
  const { name } = req.body;
  const me = req.user._id;
  User.findByIdAndUpdate(
    me,
    { name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          _id: user._id,
        });
      } else {
        next(new NotFoundError(Constants.HTTP_NOT_FOUND));
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError(Constants.HTTP_BAD_REQUEST));
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};
