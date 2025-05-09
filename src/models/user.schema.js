const mongoose = require("mongoose");
var validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      // The trim() method removes all whitespace characters, not just spaces. That includes tabs and newlines.
      //let str = '\thello world\n';
      //str.trim(); // 'hello world'
      validate: function emailValidate(value) {
        return validator.isEmail(value);
      },
    },
    password: {
      type: String,
      minLength: 8,
    },
    age: {
      type: Number,
      min: 18, // for number its min , for string its minLength,
      max: 60,
    },
    gender: {
      type: String,
      //custom validator
      validate: function isValidate(value) {
        if (!["male", "female", "others"].includes(value)) {
          return false; // mongoose by default throw error if validate function returns false value , for sucess it shows true
        }
        return true;
      },
    },
    photoUrl: {
      type: String,
      validate: function isUrl(value) {
        return validator.isURL(value);
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "Default about",
    },
  },
  { timestamps: true },
);

UserSchema.index({
  email: 1,
});
const userModel = mongoose.model("User", UserSchema);
userModel.init();
module.exports = userModel;
