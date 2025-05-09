const express = require("express");
const { adminAuth } = require("../utils/middlewares/auth");
const userRouter = express.Router();
const connectionRequestModel = require("../models/connectionRequest.schema.js");
const userModel = require("../models/user.schema.js");

// to find pending reqs
userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about",
      ]);
    return res.status(200).json({
      message: "Connection requests pending",
      data: connectionRequests,
    });
  } catch (e) {
    res.status(400).send(`Error ${e.message}`);
  }
});

userRouter.get("/user/requests/accepted", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about",
      ]);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res.status(200).json({
      message: "Connection requests ",
      data: data,
    });
  } catch (e) {
    res.status(400).send(`Error ${e.message}`);
  }
});

userRouter.get("/user/feed", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequestModel.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    });
    const hideUsersList = new Set();
    connectionRequests.forEach((request) => {
      hideUsersList.add(request.fromUserId);
      hideUsersList.add(request.toUserId);
    });
    //add logged in user to hidden list
    hideUsersList.add(loggedInUser._id);

    const users = await userModel
      .find({
        _id: { $nin: Array.from(hideUsersList) },
      })
      .select([
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills",
        "about",
      ])
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      message: "Feed fetch sucess",
      data: users,
    });
  } catch (e) {
    res.status(400).send(`Error ${e.message}`);
  }
});

module.exports = userRouter;
