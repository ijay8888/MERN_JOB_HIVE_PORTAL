import Job from "../model/job.model.js";
import { JobApplication } from "../model/jobApplication.model.js";

export const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description , jobType,category} = req.body;

    const newJob = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      jobType:jobType || "Full-Time",
      category:category || "General",
      postedBy: req.user._id,
    });

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    console.error("🔥 CREATE JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;
    let filters = {};

    if (keyword) {
      filters.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(filters)
      .populate("postedBy", "fullName email")
      .populate("applicants", "_id");

    res.json({ success: true, jobs });
  } catch (err) {
    console.error("🔥 FETCH JOBS ERROR:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "postedBy",
      "fullName email"
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    console.error("🔥 GET JOB BY ID ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only recruiter who posted can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
    });

    res.json({ success: true, message: "Job updated", job: updatedJob });
  } catch (error) {
    console.error("🔥 UPDATE JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.jobId);

    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("🔥 DELETE JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};


export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existing = await JobApplication.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const application = await JobApplication.create({
      job: job._id,
      applicant: req.user._id,
      recruiter: job.postedBy,
    });

    job.applicants.push(req.user._id);
    await job.save();

    res.json({
      success: true,
      message: "Application submitted!",
      application,
    });
  } catch (error) {
    console.error("APPLY JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to apply" });
  }
};


export const getAppliedJobs = async (req, res) => {
  try {
    const seekerId = req.user._id;
    const applications = await JobApplication.find({ applicant: seekerId })
      .populate("job", "title company location salary description")
      .populate("recruiter", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("FETCH APPLIED JOBS ERROR:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch applied jobs" });
  }
};


export const getApplicants = async (req, res) => {
  try {
    const applications = await JobApplication.find({ job: req.params.jobId }).populate(
      "applicant",
      "fullName email phoneNumber resume"
    );


    const applicants = applications
      .map((app) => app.applicant)
      .filter((applicant) => applicant !== null);

    res.json({
      success: true,
      applicants,
    });
  } catch (err) {
    console.error("🔥 FETCH APPLICANTS ERROR:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch applicants" });
  }
};


export const searchPublicJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, category } = req.query;
    let filter = {};

    if (keyword) {
      filter.$or = [
        { title: new RegExp(keyword, "i") },
        { company: new RegExp(keyword, "i") },
      ];
    }

    if (location) filter.location = new RegExp(location, "i");
    if (jobType) filter.jobType = jobType;
    if (category) filter.category = category;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    console.error("SEARCH PUBLIC JOBS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};


