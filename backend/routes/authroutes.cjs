const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.cjs");
const GoogleUser = require("../models/googleUserModel.cjs");

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
    });

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No account found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Login success", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- GOOGLE LOGIN ---------------- */
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    let user = await GoogleUser.findOne({ email });

    if (!user) {
      user = await GoogleUser.create({ email, name, picture });
    }

    res.json({ message: "Google login success", user });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
