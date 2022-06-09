const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "please tell us your email id"],
    minlength: [8, "email id should contain minimum of 8 charecters "],
    lowercase: true,
    validate: [validator.isEmail, "please provide valid email"],
  },

  password: {
    type: String,
    // unique: true,
    required: [true, "please tell us your password"],
    minlength: [8, "password should contain minimum of 8 charecters "],
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: [true, "please tell us your phone number"],
    // validate: {
    //   validator: function (v) {
    //     return `${v}`.length !== 10;
    //   },
    //   message: "{VALUE} is not a valid 10 digit number!",
    // },
  },
});

userSchema.pre("save", async function (next) {
  //only run this function if password was modified
  if (!this.isModified("password")) return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
