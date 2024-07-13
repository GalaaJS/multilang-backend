const logger = require('./../utilities/logger');

async function isAuthenticated(req, res, next) {
  try {
    if (req.url === '/user/login') {
      return next();
    }

    const cookies = req.cookies;
    if (cookies && cookies.access_token) {
      const token = cookies.access_token;
      const session = null; // TODO get user session using token

      if (session) {
        // TODO check session (expired etc..,)
        return next();
      } else {
        logger.error('Unauthorized');
        res.unauthorized();
      }
    } else {
      logger.error('Unauthorized');
      res.unauthorized();
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = { isAuthenticated };
