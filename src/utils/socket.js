const socket = require("socket.io");

const socketInit = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ fromUser, toUserId, fromFirst }) => {
      const roomId = [fromUser, toUserId].sort().join("_");
      fromFirst && socket.join(roomId);
    });
    socket.on("sendMessage", ({ fromUser, toUserId, fromFirst, text }) => {
      const roomId = [fromUser, toUserId].sort().join("_");
      io.to(roomId).emit("messageReceived", { fromFirst, text });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = socketInit;
