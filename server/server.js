require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({ origin: "https://inventory-management-system-1-w4pp.onrender.com" }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "server is alive" });
});

app.use((err, req, res, next) => {
  if (err) {
    console.log("unhandled error:", err.message);
    return res
      .status(400)
      .json({ message: err.message || "Something went wrong" });
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

sequelize
  .sync()
  .then(() => {
    console.log("database synced");
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("failed to connect to database:", err);
  });
