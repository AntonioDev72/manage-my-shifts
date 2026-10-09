const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { isAdmin } = require("../middleware/auth");

// Admin can access any comment; a user can only access their own
function canAccess(req, comment) {
  return isAdmin({ role: req.userRole }) || String(comment.userId) === String(req.userId);
}

// GET api/comment/ - getAllComments (admin only)
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("userId", "firstName lastName email");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/comment/user/:userId - getAllUserComments (admin or the user themselves)
const getAllUserComments = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isAdmin({ role: req.userRole }) && String(userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const comments = await Comment.find({ userId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/comment/:id - getCommentById
const getCommentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment || !canAccess(req, comment)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST api/comment/ - createComment (userId comes from the token)
const createComment = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    const comment = await Comment.create({ userId: req.userId, description });

    // Keep the user's comments array in sync
    await User.findByIdAndUpdate(req.userId, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH api/comment/:id - updateCommentById (owner or admin)
const updateCommentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment || !canAccess(req, comment)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const { description } = req.body;
    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ message: "Description is required" });
      }
      comment.description = description;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE api/comment/:id - deleteComment (admin only)
const deleteComment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await User.findByIdAndUpdate(comment.userId, { $pull: { comments: comment._id } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllComments,
  getAllUserComments,
  getCommentById,
  createComment,
  updateCommentById,
  deleteComment,
};
