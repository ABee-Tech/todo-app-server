import winston from "winston";

const logFolder = __dirname + "/../logs";

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: logFolder + "/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: logFolder + "/combined.log",
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

export default Logger;
