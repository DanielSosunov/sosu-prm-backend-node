var { logger } = require("./env");

const logRequestDetails = (req, res, next) => {
  logger.debug("Request Path:", req.path);
  logger.debug("Request URL:", req.url);
  logger.debug("Request Method:", req.method);
  logger.debug("Request Headers:", req.headers);
  logger.debug("Request Body:", req.body);
  logger.debug("Request Query:", req.query);
  next(); // Pass control to the next middleware in the chain
};

module.exports = {
  logRequestDetails,
};
