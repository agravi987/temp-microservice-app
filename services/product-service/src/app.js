require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const products = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Keyboard", price: 2500 },
  { id: 3, name: "Mouse", price: 1200 },
];

app.get("/", (req, res) => {
  res.json({ message: "Product Service Running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    service: process.env.SERVICE_NAME || "product-service",
    status: "OK",
  });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  return res.json(product);
});

const port = Number(process.env.PORT || 3002);

app.listen(port, "0.0.0.0", () => {
  console.log(`Product service running on port ${port}`);
});
