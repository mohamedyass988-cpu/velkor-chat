const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";
let users = fs.existsSync(USERS_FILE)
  ? JSON.parse(fs.readFileSync(USERS_FILE))
  : {};

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { username, nickname, age, gender, password } = req.body;

  if (!username || !nickname || !age || !gender || !password)
    return res.json({ error: "بيانات ناقصة" });

  if (users[username])
    return res.json({ error: "المستخدم موجود بالفعل" });

  users[username] = { nickname, age, gender, password };
  saveUsers();

  res.json({ ok: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username])
    return res.json({ error: "المستخدم غير موجود" });

  if (users[username].password !== password)
    return res.json({ error: "كلمة المرور خاطئة" });

  res.json({ ok: true });
});

io.on("connection", socket => {
  socket.on("chat", msg => io.emit("chat", msg));
});

server.listen(3000, () =>
  console.log("Server running http://localhost:3000")
);