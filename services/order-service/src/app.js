require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const orders = [];

app.get("/", (req, res) => {
  res.json({ message: "Order Service Running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: process.env.SERVICE_NAME || "order-service",
    status: "OK",
  });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      message: "userId, productId, and quantity are required",
    });
  }

  const order = {
    id: orders.length + 1,
    userId,
    productId,
    quantity,
    status: "CREATED",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  return res.status(201).json(order);
});

const port = Number(process.env.PORT || 3003);

app.listen(port, "0.0.0.0", () => {
  console.log(`Order service running on port ${port}`);
});
