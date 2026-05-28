const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }

  const existingUser = await db.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    return res.status(409).json({ message: "user already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, passwordHash],
  );

  return res.status(201).json(result.rows[0]);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const result = await db.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return res.json({ token });
}

module.exports = {
  register,
  login,
};
