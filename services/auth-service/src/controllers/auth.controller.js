const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = [];

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({ message: "user already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    passwordHash,
  };

  users.push(user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = users.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

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
