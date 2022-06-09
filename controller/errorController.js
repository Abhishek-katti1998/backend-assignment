const AppError = require("../utils/appError");

const handleCastErrDB = (err) =>
  new AppError(`Invalid ${err.path}:${err.value}.please try again!`, 400);
const handleDuplicateIDErrDB = (err) => {
  const message = `Duplicate field value:${err.keyValue.name} please try with other value!`;
  return new AppError(message, 400);
};
const handleValidationErrDB = (err) => {
  const message = Object.values(err.errors).map((e) => e.message);
  // console.log(err.errors);
  return new AppError(message.join(". "), 400);
};
const handleJWTerror = () =>
  new AppError("Invalid Token please login again!", 401);
const handleTokenExpireError = () =>
  new AppError("Token expired!please login again", 401);
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    stack: err.stack,
    message: err.message,
    error: err,
  });
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.log("ERROR", err);
    res.status(500).json({
      result: "error",
      message: "something went very wrong!",
    });
  }
};
module.exports = function (err, req, res, next) {
  //   let message = err.message;
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (err.name === "CastError") {
      error = handleCastErrDB(err);
    }
    if (error.code === 11000) {
      error = handleDuplicateIDErrDB(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidationErrDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJWTerror();
    }
    if (err.name === "TokenExpiredError") {
      error = handleTokenExpireError();
    }
    sendProdError(error, res);
  }
};
