const express = require("express");
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const shifts = await Shift.find({ worker: req.userId });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;