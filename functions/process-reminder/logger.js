const log4js = require("log4js");

// Configure log4js
log4js.configure({
  appenders: {
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["console"], level: "info" },
  },
});

// Create a logger instance
const logger = log4js.getLogger();

module.exports = logger;
