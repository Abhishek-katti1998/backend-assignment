const jwt = require("jsonwebtoken");

// const crypto = require("crypto");
const User = require("../Models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  const newUser = await User.create({
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: req.body.password,
  });
  const token = signToken(newUser._id);
  //   jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  res.status(201).json({
    status: "success",
    token,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1.check email and password
  if (!email || !password)
    return next(new AppError("please enter email and password", 400));
  //2.check if user exists and password is correct
  //when we want the fields to be selected which are by default not selected we use +
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  //3.if everything is ok send token back to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "succes",
    token,
  });
});
