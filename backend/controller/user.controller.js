import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Job from "../model/job.model.js";
import { JobApplication } from "../model/jobApplication.model.js";

export const registerUser = async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, role } = req.body;

    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();
    phoneNumber = phoneNumber?.trim();
    role = role?.trim();

    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and cannot be blank.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/^\d{10,15}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain only digits (10–15 chars)",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Role mismatch! Please login with correct role.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePhoto: user.profilePhoto || null,
      resume: user.resume || null,
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err.message);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};


export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let extraData = {};

    if (user.role === "seeker") {
      // Fetch applied jobs
      const applications = await JobApplication.find({ applicant: req.user._id })
        .populate("job", "title company location salary");

      const appliedJobs = applications.map((app) => app.job);
      extraData = { appliedJobs };
    } else if (user.role === "recruiter") {

      const postedJobs = await Job.find({ postedBy: req.user._id }).select(
        "title company applicants location"
      );
      extraData = { postedJobs };
    }

    res.json({
      success: true,
      user,
      ...extraData,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title company location salary description",
      })
      .populate({
        path: "recruiter",
        select: "fullName email",
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications: apps,
    });
  } catch (err) {
    console.error("APPLICATION FETCH ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};
