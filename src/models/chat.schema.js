const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: MessagesSchema,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.model("chat-messages", ChatSchema);
module.exports = chatModel;
