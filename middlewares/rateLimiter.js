const rateLimit = require('express-rate-limit');
const Constants = require('../utils/constants');

exports.rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 1000000,
  message: Constants.TRY_LIMITED,
  standardHeaders: true,
  legacyHeaders: false,
});