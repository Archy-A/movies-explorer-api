require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorCatcher = require('./middlewares/main-error-catcher');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const Config = require('./utils/config');
const validator = require('./routes/validation');
const rateLimiter = require('./middlewares/rateLimiter');

const { PORT = Config.PORT_DEFAULT} = process.env;
const { MONGODBIP = Config.DEV_MODE_MONGO_DB_IP } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());

mongoose.connect(`mongodb://${MONGODBIP}`);

const allowedCors = [
  'https://dipp.nomoredomains.work',
  'http://dipp.nomoredomains.work',
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

app.use(rateLimiter.rateLimiterUsingThirdParty);

const signup = require('./routes/signup');

app.use('/signup', validator.validateSignUP(), signup);

const login = require('./routes/login');

app.use('/signin', validator.validateSignIN(), login);

app.use(auth);

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
