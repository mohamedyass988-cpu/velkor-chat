const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// الصفحات
// =====================

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// صفحة إنشاء حساب
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// صفحة الشات (اختياري لكن مفيد)
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// =====================
// إدارة المستخدمين
// =====================

const USERS_FILE = path.join(__dirname, "users.json");

let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// إنشاء حساب
app.post("/register", (req, res) => {
  const { username, lastname, age, gender, password } = req.body;

  if (!username || !lastname || !age || !gender || !password) {
    return res.status(400).json({ error: "بيانات ناقصة" });
  }

  if (users[username]) {
    return res.status(400).json({ error: "المستخدم موجود بالفعل" });
  }

  users[username] = {
    lastname,
    age,
    gender,
    password
  };

  saveUsers();
  res.json({ ok: true });
});

// تسجيل دخول
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username]) {
    return res.status(401).json({ error: "المستخدم غير موجود" });
  }

  if (users[username].password !== password) {
    return res.status(401).json({ error: "كلمة المرور خاطئة" });
  }

  res.json({ ok: true });
});

// =====================
// Socket.io - الشات
// =====================

io.on("connection", (socket) => {
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });
});

// =====================
// تشغيل السيرفر
// =====================

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});