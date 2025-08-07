import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./utils/db.js";
import { User } from "./model/user.model.js";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await User.create({
    fullName: "Admin",
    email: adminEmail,
    password: hashedPassword,
    phoneNumber: "9999999999",
    role: "admin",
    isActive: true,
  });

  console.log("Admin user created:", admin.email);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
