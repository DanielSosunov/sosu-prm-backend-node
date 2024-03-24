const logger = {
  info: (...args) => {
    console.log(`[${new Date().toLocaleString()}] INFO:`, ...args);
  },
  debug: (...args) => {
    console.log(`[${new Date().toLocaleString()}] DEBUG:`, ...args);
  },
  error: (...args) => {
    console.error(`[${new Date().toLocaleString()}] ERROR:`, ...args);
  },
};

module.exports = logger;
