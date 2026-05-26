require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Auth Service Running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: process.env.SERVICE_NAME || "auth-service",
    status: "OK",
  });
});

app.use("/auth", authRoutes);

const port = Number(process.env.PORT || 3001);

app.listen(port, "0.0.0.0", () => {
  console.log(`Auth service running on port ${port}`);
});
