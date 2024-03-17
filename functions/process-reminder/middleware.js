var { logger, env } = require("./env");
var { accessSecret } = require("./secretmanager");
var jwt = require("jsonwebtoken");

const logRequestDetails = (req, res, next) => {
  logger.debug("Request Path:", req.path);
  logger.debug("Request URL:", req.url);
  logger.debug("Request Method:", req.method);
  logger.debug("Request Headers:", req.headers);
  logger.debug("Request Body:", req.body);
  logger.debug("Request Query:", req.query);
  next(); // Pass control to the next middleware in the chain
};

// Middleware function to verify JWT token
const verifyTokenMiddleware = async (req, res, next) => {
  try {
    // Extract token from request headers or query parameters
    const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent in the Authorization header

    // Get JWT secret from Secret Manager or other secure storage
    const jwtSecret = await accessSecret(env.JWT_SECRET);

    // Verify the JWT token with the secret key
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the decoded payload to the request object for later use
    req.userId = decoded.userId;

    // Call next middleware or route handler
    next();
  } catch (error) {
    // If verification fails, send an error response
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  logRequestDetails,
  verifyTokenMiddleware,
};
