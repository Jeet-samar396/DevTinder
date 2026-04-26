const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://dev-tinder-gamma-vert.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    // ================= JOIN CHAT =================
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      socket.join(roomId);

      console.log(`${firstName} joined room: ${roomId}`);
    });

    // ================= SEND MESSAGE =================
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          if (!text?.trim()) return;

          const roomId = getSecretRoomId(userId, targetUserId);

          // 🔥 Find existing chat
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // 🔥 Create new chat if not exists
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // 🔥 Save message
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // 🔥 Emit to both users in room
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
          });

        } catch (err) {
          console.error("❌ Socket Error:", err.message);
        }
      }
    );

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;