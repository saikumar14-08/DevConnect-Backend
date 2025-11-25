const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

// Optional: Log to console in dev mode
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;
