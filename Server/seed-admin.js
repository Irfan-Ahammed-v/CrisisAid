/**
 * run with: node seed-admin.js
 * Creates or resets the admin account with a properly bcrypt-hashed password.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");

// ── Change these if you want different credentials ──────────
const ADMIN_NAME     = "Super Admin";
const ADMIN_EMAIL    = "admin@crisisaid.com";
const ADMIN_PASSWORD = "Admin@1234";
// ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Admin.findOne({ admin_email: ADMIN_EMAIL });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existing) {
      // Reset the password to ensure it's properly hashed
      existing.admin_password = hashedPassword;
      existing.admin_name = ADMIN_NAME;
      await existing.save();
      console.log("✅ Admin password reset successfully.");
    } else {
      await Admin.create({
        admin_name: ADMIN_EMAIL,
        admin_email: ADMIN_EMAIL,
        admin_password: hashedPassword,
      });
      console.log("✅ Admin account created successfully.");
    }

    console.log("\n── Login Credentials ─────────────────────");
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("──────────────────────────────────────────\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seed();
