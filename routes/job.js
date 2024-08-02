import express from "express";
import {
  createJob,
  getAllJobs,
  getJobDetails,
  applyToJob,
} from "../controllers/jobs.js";
import { auth } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";
const router = express.Router();

router.post("/", auth,checkRole('employer'), createJob);
router.get("/", auth, getAllJobs);
router.get("/:jobId", auth, getJobDetails);
router.post("/:jobId/apply", auth,checkRole('freelancer'), applyToJob);

export default router;
