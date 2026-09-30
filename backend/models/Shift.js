const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  hourlyWage: { type: Number, required: true },
  workplace: { type: String, required: true },
  slug: { type: String, required: true },
  comments: { type: String },
  totalEarning: { type: Number, required: true },
});

module.exports = mongoose.model("Shift", shiftSchema);