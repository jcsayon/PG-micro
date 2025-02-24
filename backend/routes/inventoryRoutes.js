const express = require("express");
const router = express.Router();
const supabase = require("../services/supabaseService");

// Get all inventory items
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("inventory").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// Add new inventory item
router.post("/add", async (req, res) => {
  const { name, category, quantity, price } = req.body;

  const { data, error } = await supabase
    .from("inventory")
    .insert([{ name, category, quantity, price }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Item added successfully", item: data });
});

// ✅ Ensure correct export
module.exports = router;
