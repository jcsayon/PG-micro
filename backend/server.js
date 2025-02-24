require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Authentication
const inventoryRoutes = require("./routes/inventoryRoutes"); // Inventory Management

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("✅ PG Micro Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
