const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  // "admin" or "regular_user"
  description: { type: String, required: true, unique: true, enum: ["admin", "regular_user"] },
});

module.exports = mongoose.model("Permission", permissionSchema);
