import express from "express";
import {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobs,
  toggleJobStatus,
  deleteJob,
  getAllApplications,
  deleteApplication,
} from "../controller/admin.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyAdmin);

router.get("/dashboard", getAdminStats);

router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);


router.get("/jobs", getAllJobs);
router.put("/jobs/:id/toggle", toggleJobStatus);
router.delete("/jobs/:id", deleteJob);

router.get("/applications", getAllApplications);
router.delete("/applications/:id", deleteApplication);

export default router;
