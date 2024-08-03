import express from "express";
import {
  login,
  register,
  updateUserProfile,
  getUserDetails,
} from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/:id", auth, updateUserProfile);
router.get("/:id", auth, getUserDetails);

export default router;
