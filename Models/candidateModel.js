const mongoose = require("mongoose");
const validator = require("validator");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
    // validate: [validator.isAlpha, 'name should cotnain only alphabets'],
  },
  emailAddress: {
    type: String,
    unique: true,
    required: [true, "please tell us your email id"],
    minlength: [8, "email id should contain minimum of 8 charecters "],
    lowercase: true,
    validate: [validator.isEmail, "please provide valid email"],
  },
  age: {
    type: Number,
    required: [true, "please tell us your age"],
  },
  DateofBirth: {
    type: Date,
    required: [true, "please tell us your DOB"],
  },
  pinCode: {
    type: Number,
    required: [true, "please tell us your Area PinCode"],
  },
  state: {
    type: String,
    required: [true, "please tell us your state name"],
  },
  shortlisted: Boolean,
});
const candidateModel = mongoose.model("candidate", candidateSchema);
module.exports = candidateModel;
