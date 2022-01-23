const Logger = require("../utils/logger");
const { ApiError } = require("../handlers/buildError");

function apiErrorHandler(err, req, res, next) {
  Logger.log("error", err.stack);

  if (err instanceof ApiError) {
    res.status(err.code).json({ status: err.code, message: err.message });
    return;
  }
  if (err.code === 404) {
    res.status(err.code).json({ status: err.code, message: err.message });
    return;
  }
  res.status(500).json({ status: 500, message: "Internal Server Error" });
}

module.exports = apiErrorHandler;
