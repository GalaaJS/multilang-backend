const logger = require('../utilities/logger');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  logger.error(message);
  res.status(statusCode || 500).json({
    status: false,
    statusCode: statusCode || 500,
    message: message || 'Internal server error',
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
