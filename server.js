require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
connectDB(process.env.MONGO_URI);
const authRoutes = require("./routes/auth");

const GroupMessage = require("./models/GroupMessage");
const PrivateMessage = require("./models/PrivateMessage");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/view", express.static(path.join(__dirname, "view")));

app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const ROOMS = ["devops", "cloud computing", "covid19", "sports", "nodeJS"]; 

io.on("connection", (socket) => {
    socket.on("setUsername", ({ username }) => {
  if (!username || !username.trim()) return;
  socket.data.username = username.trim();
});

  socket.on("joinRoom", async ({ username, room }) => {
    if (!username || !room || !ROOMS.includes(room)) return;

    if (socket.data.room) socket.leave(socket.data.room);

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    socket.emit("system", { message: `Joined room: ${room}` });

    const history = await GroupMessage.find({ room }).sort({ date_sent: 1 }).limit(50).lean();
    socket.emit("groupHistory", history);
  });

  socket.on("leaveRoom", () => {
    if (socket.data.room) {
      socket.leave(socket.data.room);
      socket.emit("system", { message: "You left the room." });
      socket.data.room = null;
    }
  });

  socket.on("groupMessage", async ({ message }) => {
    const username = socket.data.username;
    const room = socket.data.room;
    if (!username || !room || !message?.trim()) return;

    const doc = await GroupMessage.create({
      from_user: username,
      room,
      message: message.trim()
    });

    io.to(room).emit("groupMessage", {
      from_user: doc.from_user,
      room: doc.room,
      message: doc.message,
      date_sent: doc.date_sent
    });
  });

  socket.on("privateTyping", ({ to_user, isTyping }) => {
    const from_user = socket.data.username;
    if (!from_user || !to_user) return;
    io.emit("privateTyping", { from_user, to_user, isTyping: !!isTyping });
  });

  socket.on("privateMessage", async ({ to_user, message }) => {
    const from_user = socket.data.username;
    if (!from_user || !to_user || !message?.trim()) return;

    const doc = await PrivateMessage.create({
      from_user,
      to_user,
      message: message.trim()
    });

    io.emit("privateMessage", {
      from_user: doc.from_user,
      to_user: doc.to_user,
      message: doc.message,
      date_sent: doc.date_sent
    });
  });
});

app.get("/", (req, res) => res.redirect("/view/login.html"));

(async () => {
  await connectDB(process.env.MONGO_URI);
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
})();
