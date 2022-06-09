const jwt = require("jsonwebtoken");
const { promisify } = require("util");
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
    data: { newUser },
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
exports.protect = catchAsync(async (req, res, next) => {
  //1.Getting token and check if its there

  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  // console.log('token', token);
  if (!token)
    return next(
      new AppError("You are not logged in! please log in to get acces", 401)
    );

  //2.Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETE);
  // console.log(decoded);
  const curUser = await User.findById(decoded.id);
  if (!curUser)
    return next(
      new AppError(
        "The user belonging to this token does no longer exists",
        401
      )
    );

  //3.check if user is still exists
  //4.check if user changed password after token is issued
  //   if (curUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //       new AppError("User recently changed password!please login again", 401)
  //     );
  //   }

  //grant acces to protected routes
  req.user = curUser;
  //   console.log("USER---->", req.user);
  next();
});
