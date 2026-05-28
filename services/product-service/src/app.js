require("dotenv").config();

const express = require("express");
const db = require("./db");
const redis = require("./cache");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Product Service Running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: process.env.SERVICE_NAME || "product-service",
    status: "OK",
  });
});

app.get("/products", async (req, res) => {
  const cacheKey = "products:all";
  const cachedProducts = await redis.get(cacheKey);

  if (cachedProducts) {
    return res.json(JSON.parse(cachedProducts));
  }

  const result = await db.query(
    "SELECT id, name, price FROM products ORDER BY id",
  );

  await redis.setex(cacheKey, 60, JSON.stringify(result.rows));

  return res.json(result.rows);
});

app.get("/products/:id", async (req, res) => {
  const result = await db.query(
    "SELECT id, name, price FROM products WHERE id = $1",
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "product not found" });
  }

  return res.json(result.rows[0]);
});

const port = Number(process.env.PORT || 3002);

app.listen(port, "0.0.0.0", () => {
  console.log(`Product service running on port ${port}`);
});
