import express from "express";
import {
  getOverviewStats,
} from "../controllers/overview.controller.js";

const router = express.Router();

router.get("/", getOverviewStats);

export default router;
