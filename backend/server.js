const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shiftRoutes = require("./routes/shift");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/shifts", shiftRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
