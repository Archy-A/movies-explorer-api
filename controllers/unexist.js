const Constants = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');

exports.processUnexist = (req, res, next) => {
  const err = new NotFoundError(Constants.PAGE_NOT_FOUND);
  next(err);
};
