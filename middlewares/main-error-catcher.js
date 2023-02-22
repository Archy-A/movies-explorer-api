module.exports = (err, req, res, next) => {
    console.log('error = ', err);
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла какая-то ошибка, ..........................'
          : message,
      });
    next();
  };
  