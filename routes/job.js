import express from "express";
import multer from "multer";
import {
  createJob,
  getAllJobs,
  getJobDetails,
  applyToJob,
  getJobsPostedByUser,
  getAppliedJobsByUser,
} from "../controllers/jobs.js";
import { auth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  auth,
  checkRole("employer"),
  upload.single("descriptionFile"), // Ensure the key matches the form-data key
  createJob
);
router.get("/", auth, getAllJobs);
router.get("/:jobId", auth, getJobDetails);
router.get(
  "/postedBy/:userId",
  auth,
  checkRole("employer"),
  getJobsPostedByUser
);
router.get(
  "/appliedBy/:userId",
  auth,
  checkRole("freelancer"),
  getAppliedJobsByUser
);
router.post("/apply", auth, checkRole("freelancer"), applyToJob);

export default router;
