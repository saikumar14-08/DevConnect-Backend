const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionrequest");
const { default: mongoose } = require("mongoose");

const getSecretRoom = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const socketInit = (server) => {
  const io = socket(server, {
    path: "/api/socket.io", // For Production
    cors: {
      origin: "https://www.devconnekt.com", // For Production
      // origin: "http://localhost:5173", For local
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUser, toUserId, fromFirst }) => {
      const roomId = getSecretRoom(fromUser, toUserId);
      fromFirst && socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ fromUser, toUserId, fromFirst, text }) => {
        try {
          const roomId = getSecretRoom(fromUser, toUserId);
          const from = new mongoose.Types.ObjectId(fromUser);
          const to = new mongoose.Types.ObjectId(toUserId);
          const friendCheck = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: from,
                toUserId: to,
                status: "accepted",
              },
              {
                fromUserId: to,
                toUserId: from,
                status: "accepted",
              },
            ],
          });

          if (!friendCheck) {
            return;
          }
          let chat = await Chat.findOne({
            participants: { $all: [from, to] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [from, to],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: from,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            text,
            fromFirst,
            fromUserId: fromUser, // This can stay string, since frontend expects it
          });
        } catch (e) {
          console.log("❌ Error in sendMessage:", e.message);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = socketInit;
