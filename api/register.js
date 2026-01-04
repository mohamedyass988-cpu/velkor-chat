import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("❌ MONGO_URI is not defined");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { username, lastname, age, gender, password } = req.body;

    if (!username || !lastname || !age || !gender || !password) {
      return res.status(400).json({ ok: false, error: "جميع الحقول مطلوبة" });
    }

    const client = await clientPromise;
    const db = client.db("velkor");
    const users = db.collection("users");

    const exists = await users.findOne({ username });
    if (exists) {
      return res.status(409).json({ ok: false, error: "المستخدم موجود مسبقًا" });
    }

    await users.insertOne({
      username,
      lastname,
      age,
      gender,
      password, // لاحقًا نعمل hash
      createdAt: new Date()
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "خطأ في السيرفر" });
  }
}