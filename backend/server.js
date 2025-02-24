require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ✅ Ensure you import the routes correctly
const authRoutes = require("./routes/authRoutes"); 
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); 

// ✅ Use routes correctly
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("✅ PG Micro Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
