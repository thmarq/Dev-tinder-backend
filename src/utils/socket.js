const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chat.schema");

const generateRoomId = (userId, targetUserId) => {
  const roomId = [userId, targetUserId].sort().join("_");
  return crypto.createHash("sha256").update(roomId).digest("hex");
};

const initializeSocket = (socketServer) => {
  const io = socket(socketServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  //handling connections
  io.on("connection", (socket) => {
    // ...handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = generateRoomId(userId, targetUserId);
      console.log(firstName + " Joined room ====> ", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          let chat = await chatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new chatModel({
              participants: [userId, targetUserId],
            });
          }
          chat.messages.push({
            senderId: userId,
            message: text,
          });
          let resp = await chat.save();
          console.log("Message created success  for last name:", lastName);
          console.log("Message created success  :", resp);
        } catch (e) {
          console.log("Error in Sending Messages ===============", e.message);
        }
        const roomId = generateRoomId(userId, targetUserId);
        console.log(firstName + " : Send message to : " + text);
        //sending message to roomID
        io.to(roomId).emit("messageReceived", { firstName, text });
      },
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
