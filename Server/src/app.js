const express = require("express");
const app = express();
const http = require("http");

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
require("./utils/cronjob");

// ================= CORS =================
const allowedOrigins = [
  "https://dev-tinder-gamma-vert.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

// ================= STATIC =================
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

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).send(err.message || "Something broke!");
});

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