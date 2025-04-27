import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  handleSuccessDonation,
  processDonation,
  getAllDonations,
  getAllDonationsByUserId,
  getAllDonationsForOrphanage,
  getAllDonationsGroupedByOrphanages,
} from "../controllers/donation.controller.js";

const router = express.Router();

// Admin: Get all donations
router.get("/", authenticate, authorize(["admin"]), getAllDonations);

// User: Get donations by user ID
router.get(
  "/user/:id",
  authenticate,
  authorize(["admin", "orphanage", "donor"]),
  getAllDonationsByUserId
);

// Admin: Get all donations received by orphanages
router.get(
  "/orphanages",
  authenticate,
  authorize(["admin"]),
  getAllDonationsGroupedByOrphanages
);

// Orphanage-specific: Get donations for a specific orphanage
router.get(
  "/orphanages/:id",
  authenticate,
  authorize(["orphanage"]),
  getAllDonationsForOrphanage
);

// You don't have to be authenticated or authorized to donate
router.post("/donate", processDonation);
router.post("/success-donate", handleSuccessDonation);

export default router;
