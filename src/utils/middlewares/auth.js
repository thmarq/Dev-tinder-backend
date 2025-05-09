var jwt = require("jsonwebtoken");
const userModel = require("../../models/user.schema");

const adminAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie) {
      throw new Error("Cookie not found"); // to prevent info leaking
    }
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("Please login"); // to prevent info leaking , actual is token not found
    }
    const decoded = await jwt.verify(token, "SECRET_KEY");
    const user = await userModel.findById({ _id: decoded._id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next(); // to call the next req handler
  } catch (e) {
    res.status(400).send(`Bad request ${e.message}`);
  }
};
module.exports = { adminAuth };
