import express from "express";
import {
  createOrphan,
  deleteOrphan,
  getOrphan,
  getOrphans,
  updateOrphan,
} from "../controllers/orphan.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getOrphans);
router.get("/:id", getOrphan);

// Only Orphanage allowed to create, update, or delete orphans
router.post("/", authenticate, authorize(["orphanage"]), createOrphan);
router.delete("/:id", authenticate, authorize(["orphanage"]), deleteOrphan);
router.put(
  "/:id",
  authenticate,
  authorize(["orphanage"]),
  updateOrphan
);

export default router;
