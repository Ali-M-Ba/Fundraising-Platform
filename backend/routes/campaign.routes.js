import express from "express";
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaign);

// Only Orphanage allowed to create, update, or delete Campaigns
router.post("/", authenticate, authorize(["orphanage"]), createCampaign);
router.delete("/:id", authenticate, authorize(["orphanage"]), deleteCampaign);
router.put("/:id", authenticate, authorize(["orphanage"]), updateCampaign);

export default router;
