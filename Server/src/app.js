const express = require("express");
const app = express();
const http = require("http");

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
require("./utils/cronjob");

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local
      process.env.CLIENT_URL,  // 🔥 production frontend (Vercel)
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// static files
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

// ================= SOCKET =================
const initializeSocket = require("./utils/socket");
const server = http.createServer(app);
initializeSocket(server);

// ================= DB =================
connectDB()
  .then(() => {
    console.log("Database connected successfully");

    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("DB Error:", err.message);
  });