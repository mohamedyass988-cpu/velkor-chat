import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { username, lastname, age, gender, password } = req.body;

  if (!username || !password) {
    return res.json({ ok: false, error: "بيانات ناقصة" });
  }

  const filePath = path.join(process.cwd(), "users.json");

  let users = [];

  if (fs.existsSync(filePath)) {
    users = JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.json({ ok: false, error: "اسم المستخدم موجود مسبقًا" });
  }

  users.push({
    username,
    lastname,
    age,
    gender,
    password
  });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return res.json({ ok: true });
}