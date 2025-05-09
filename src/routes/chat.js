const express = require("express");
const { adminAuth } = require("../utils/middlewares/auth");
const chatModel = require("../models/chat.schema");
const chatRouter = express.Router();

chatRouter.get("/chats/:targetUserId", adminAuth, async (req, res) => {
  const userId = req.user;
  const { targetUserId } = req.params;
  try {
    let chat = await chatModel.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
      });
      await chat.save();
    }
    console.log("Message created success :");
    res.json({ data: chat });
  } catch (e) {
    console.log("Error in Sending Messages ===============", e.message);
  }
});

module.exports = chatRouter;
