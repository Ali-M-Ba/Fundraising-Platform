import express from "express";
import {
  createOrphanage,
  deleteOrphanage,
  getOrphanage,
  getOrphanages,
  updateOrphanage,
} from "../controllers/orphanage.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getOrphanages);
router.get("/:id", getOrphanage);

// Only Admin allowed to create and delete orphanages
router.post("/", authenticate, authorize(["admin"]), createOrphanage);
router.delete("/:id", authenticate, authorize(["admin"]), deleteOrphanage);

// Admin & orphanage allowed to update orphanage info
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "orphanage"]),
  updateOrphanage
);

export default router;
