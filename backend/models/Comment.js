const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // userId refers to the user who created the comment
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("Comment", commentSchema);
