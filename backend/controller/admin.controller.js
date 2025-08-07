
import Job from "../model/job.model.js";
import {JobApplication} from "../model/jobApplication.model.js";
import { User } from "../model/user.model.js";


export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const jobSeekers = await User.countDocuments({ role: { $in: ["seeker", "student", "user"] }, });
  const recruiters = await User.countDocuments({ role: "recruiter" });
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ status: "active" });

  res.json({ totalUsers, jobSeekers, recruiters, totalJobs, activeJobs });
};

export const getAllUsers = async (req, res) => {
  const { role, isActive, startDate, endDate, search } = req.query;
    console.log("HIT getAllUsers", req.query);
  const query = {};
  if (role) query.role = role;
  if (isActive) query.isActive = isActive === "true";
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const users = await User.find(query).select("-password");
  res.json(users);
};


export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted" });
};

export const getAllJobs = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });

  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const toggleJobStatus = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  job.status = job.status === "active" ? "inactive" : "active";
  await job.save();
  res.json(job);
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  await Job.findByIdAndDelete(id);
  res.json({ message: "Job deleted" });
};

export const getAllApplications = async (req, res) => {
  const apps = await JobApplication.find()
    .populate("job", "title")
    .populate("applicant", "fullName email phoneNumber resume");
  res.json(apps);
};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  await JobApplication.findByIdAndDelete(id);
  res.json({ message: "Application deleted" });
};
