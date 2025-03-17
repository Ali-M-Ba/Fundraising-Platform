import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin-only routes
router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "orphanage"]),
  deleteUser
);

// Admin & Orphanage can update
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "orphanage"]),
  updateProfile
);

// Authenticated user only
router.get("/me", authenticate, getUser);
export default router;
