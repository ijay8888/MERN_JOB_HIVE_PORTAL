import express from "express";
import {
  createJob,
  getAllJobs,
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateJob,
  deleteJob,
  getJobById
} from "../controller/job.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { recruiterOnly, seekerOnly } from "../middleware/roleMiddleware.js";
import { searchPublicJobs } from "../controller/job.controller.js";

const router = express.Router();



router.get("/public/search", searchPublicJobs);
// Public: fetch all jobs
router.get("/", getAllJobs);

// Recruiter create job
router.post("/", authMiddleware, recruiterOnly, createJob);

// Seeker applies job
router.post("/:jobId/apply", authMiddleware, seekerOnly, applyJob);

// Seeker fetch their applied jobs
router.get("/applied/me", authMiddleware, seekerOnly, getAppliedJobs);

// Recruiter view applicants
router.get("/:jobId/applicants", authMiddleware, recruiterOnly, getApplicants);

// Single job
router.get("/:jobId", getJobById);

// Update/Delete
router.put("/:jobId", authMiddleware, recruiterOnly, updateJob);
router.delete("/:jobId", authMiddleware, recruiterOnly, deleteJob);

export default router;
