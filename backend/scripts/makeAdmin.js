// Usage (from the backend folder):  node scripts/makeAdmin.js user@email.com
require("dotenv").config();
const mongoose = require("mongoose");
const Permission = require("../models/Permission");
const User = require("../models/User");

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Permission.findOne({ description: "admin" });
  if (!admin) {
    throw new Error("Permissions not found. Run scripts/seedPermissions.js first.");
  }

  const user = await User.findOneAndUpdate({ email }, { permission: admin._id });
  console.log(user ? `${email} is now admin` : `User ${email} not found`);

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
