const express = require("express");
const router = express.Router();
const supabase = require("../services/supabaseService");

// Register User
router.post("/signup", async (req, res) => {
  const { email, password, name, role } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from("profiles").insert([{ email, name, role }]);

  res.json({ message: "User registered successfully", user: data.user });
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", email)
    .single();

  res.json({ message: "Login successful", user: data.user, role: profile.role });
});

// ✅ Ensure correct export
module.exports = router;
