require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const errorCatcher = require('./middlewares/main-error-catcher');
const Constants = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { MONGODBIP } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(`mongodb://${MONGODBIP}`);

const allowedCors = [
  'https://testdeploy.nomoredomainsclub.ru',
  'http://testdeploy.nomoredomainsclub.ru',
  'http://localhost:3000',
  'https://localhost:3000',
];

app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }
  next();
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

const signup = require('./routes/signup');

app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), signup);

const login = require('./routes/login');

app.use('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// app.use(auth);

const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

const cardsRouter = require('./routes/movies');

app.use('/movies', cardsRouter);

const unexistRouter = require('./routes/unexist');

app.use('/', unexistRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorCatcher);

app.listen(PORT, () => {
  console.log('--------------------------');
  console.log('                          ');
  console.log('SERVER HAS BEEN STARTED!!!');
  console.log('                          ');
  console.log('--------------------------');
});
