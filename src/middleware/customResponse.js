const customResponses = {
  success(payload) {
    return this.status(200).json({
      success: true,
      statusCode: 200,
      payload,
    });
  },

  unauthorized() {
    return this.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
    });
  },

  notFound() {
    return this.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Not Found',
    });
  },

  serverError() {
    return this.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  },

  forbidden() {
    return this.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Forbidden',
    });
  },
};

module.exports = (req, res, next) => {
  Object.assign(res, customResponses);
  next();
};
