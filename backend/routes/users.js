const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const workers = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, birthDate } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = birthDate;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, birthDate } = req.body;

    const worker = await User.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (email !== worker.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      worker.password = await bcrypt.hash(password, 10);
    }

    worker.email = email;
    worker.firstName = firstName;
    worker.lastName = lastName;
    worker.birthDate = birthDate;

    await worker.save();

    res.status(200).json({
      message: "Worker updated successfully",
      user: {
        id: worker._id,
        email: worker.email,
        firstName: worker.firstName,
        lastName: worker.lastName,
        birthDate: worker.birthDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await Shift.deleteMany({ worker: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
