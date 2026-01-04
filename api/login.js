import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "بيانات ناقصة" });
  }

  const filePath = path.join(process.cwd(), "users.json");

  if (!fs.existsSync(filePath)) {
    return res.status(401).json({ error: "لا يوجد مستخدمين" });
  }

  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!users[username]) {
    return res.status(401).json({ error: "اسم المستخدم غير موجود" });
  }

  if (users[username].password !== password) {
    return res.status(401).json({ error: "كلمة المرور خاطئة" });
  }

  res.status(200).json({
    ok: true,
    username
  });
}