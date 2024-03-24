var { env } = require("../env");
const logger = require("./logger");

var { accessSecret } = require("../gcp/secretmanager");
var jwt = require("jsonwebtoken");

const logRequestDetails = (req, res, next) => {
  logger.info("Request Path:", req.path);
  logger.info("Request URL:", req.url);
  logger.info("Request Method:", req.method);
  logger.info("Request Headers:", req.headers);
  logger.info("Request Body:", req.body);
  logger.info("Request Query:", req.query);
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
    var err = new Error("Unauthorized");
    err.name = "AuthorizationError";
    return errorHandler(err, req, res);
  }
};

function successHandler(req, res, next) {
  // Add a custom success method to the response object
  res.success = (data, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      data,
    });
  };

  next();
}

function errorHandler(err, req, res, next) {
  var status = 500;
  // Check if the error is a known error
  if (err.name === "ValidationError") {
    // Handle validation errors
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ errors });
  }
  if (err.name === "AuthorizationError") {
    status = 401;
  }

  // Log the error for debugging purposes
  console.error(err);

  // Return a standardized error response
  return res.status(status).json({
    error: "Internal Server Error",
    message: err.message,
  });
}

module.exports = {
  logRequestDetails,
  verifyTokenMiddleware,
  successHandler,
  errorHandler,
};
