const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Shift = require("../models/Shift");

// GET api/user/ (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/user/me (logged-in user)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/user/:id (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Shared update logic used by PATCH api/user/me and PATCH api/user/:id
const applyUserUpdate = async (userId, body, res, successMessage) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, birthDate } = body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      user.email = email;
    }

    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (birthDate !== undefined) user.birthDate = birthDate;

    await user.save();

    res.status(200).json({
      message: successMessage,
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
};

// PATCH api/user/me (logged-in user)
const updateMe = (req, res) =>
  applyUserUpdate(req.userId, req.body, res, "Profile updated successfully");

// PATCH api/user/:id (admin only)
const updateUserById = (req, res) =>
  applyUserUpdate(req.params.id, req.body, res, "User updated successfully");

// DELETE api/user/:id (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Shift.deleteMany({ worker: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getMe,
  getUserById,
  updateMe,
  updateUserById,
  deleteUser,
};
