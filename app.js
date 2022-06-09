const morgan = require("morgan");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
const candidateRouter = require("./Routes/candidateRoute");
const userRouter = require("./Routes/userRoute");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

dotenv.config({ path: "./config.env" });

//1)Middleware
//data from  body added to the request object
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes(Users)
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/users", userRouter);
app.use("/", (req, res, next) => {
  res
    .status(200)
    .json({ status: "succes", data: "Welcome to deskala assignment" });
});
//handle unhandled routes(invalid routes)
app.all("*", (req, res, next) =>
  next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404))
);
//Error handling middleware

app.use(globalErrorHandler);
module.exports = app;
