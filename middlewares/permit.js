const asyncHandler = require("express-async-handler");

const permit = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.role !== "admin") {
    req.user_id = user.id;
  }
  next();
});

module.exports = permit;
