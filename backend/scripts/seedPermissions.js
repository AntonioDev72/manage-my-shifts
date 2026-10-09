// Run once from the backend folder:  node scripts/seedPermissions.js
// 1) Creates the "admin" and "regular_user" permissions (if missing)
// 2) Migrates existing users from the old "role" field to the new "permission" field
require("dotenv").config();
const mongoose = require("mongoose");
const Permission = require("../models/Permission");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Permission.findOneAndUpdate(
    { description: "admin" }, { description: "admin" }, { upsert: true, new: true }
  );
  const regular = await Permission.findOneAndUpdate(
    { description: "regular_user" }, { description: "regular_user" }, { upsert: true, new: true }
  );

  // Use the raw collection because the User schema no longer has "role"
  const users = mongoose.connection.collection("users");

  const adminResult = await users.updateMany(
    { role: "admin" },
    { $set: { permission: admin._id }, $unset: { role: "" } }
  );
  const regularResult = await users.updateMany(
    { permission: { $exists: false } },
    { $set: { permission: regular._id }, $unset: { role: "" } }
  );

  console.log(`Permissions ready: admin, regular_user`);
  console.log(`Users migrated to admin: ${adminResult.modifiedCount}`);
  console.log(`Users migrated to regular_user: ${regularResult.modifiedCount}`);

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
