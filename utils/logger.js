const winston = require("winston");

const logFolder =
  __dirname + "/../" + process.env.LOG_FOLDER_NAME || "logs" + "/";

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: logFolder + "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: logFolder + "combined.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = Logger;
