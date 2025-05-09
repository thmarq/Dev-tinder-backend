const express = require("express");
const { signUpValidator, loginValidator } = require("../utils/validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userModel = require("../models/user.schema.js");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    loginValidator(req);
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials"); // to prevent info leaking
    }
    const isValidPwd = await bcrypt.compare(password, user.password);
    if (!isValidPwd) {
      throw new Error("Invalid credentials ");
    }
    const token = await jwt.sign({ _id: user.id }, "SECRET_KEY", {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token)
      .status(200)
      .json({ message: `Login success `, data: user });
  } catch (e) {
    res.status(404).send(`Something went wrong ${e}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  // just updating cookie with null value and expire as of now
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  return res.send("Logout success");
});

authRouter.post("/signup", async (req, res) => {
  try {
    signUpValidator(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const token = await jwt.sign({ _id: user.id }, "SECRET_KEY", {
      expiresIn: "1d",
    });
    res.cookie(token);
    return res.status(200).json({ message: "Sign up success", data: user });
  } catch (e) {
    res.status(404).send(`Something went wrong ${e}`);
  }
});

authRouter.patch("/changePassword", async (req, res) => {
  try {
    signUpValidator(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    res.status(200).send(`User created Sucess ${user}`);
  } catch (e) {
    res.status(404).send(`Something went wrong ${e}`);
  }
});

module.exports = authRouter;
