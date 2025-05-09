var validator = require("validator");

const signUpValidator = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (firstName && lastName && email && password) {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      throw new Error("Incorrect email format");
    }
    return req.body;
  } else {
    throw new Error("Please pass the mandatory fields");
  }
};

const loginValidator = (req) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!email || !password) {
    throw new Error("Please pass the mandatory fields");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = [
    "firstName",
    "age",
    "lastName",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isEdit = Object.keys(req.body).every((input) =>
    allowedEditFields.includes(input),
  );
  if (!isEdit) {
    throw new Error("Invalid edit fields in req body");
  }
  return true;
};

const validateChangePassword = (req) => {
  const allowedEditFields = ["password", "newPassword"];
  const isEdit = Object.keys(req.body).every((input) =>
    allowedEditFields.includes(input),
  );
  if (!isEdit) {
    throw new Error("Invalid edit fields , only password is required");
  }
  return true;
};
module.exports = {
  signUpValidator,
  loginValidator,
  validateEditProfile,
  validateChangePassword,
};
