import express from "express";
import { auth } from "../middleware/auth.js";
import { getApplicationsForJob } from "../controllers/applications.js";
import { checkRole } from "../middleware/checkRole.js";
const router = express.Router();

router.get("/:jobId", auth, checkRole("employer"), getApplicationsForJob);

export default router;
