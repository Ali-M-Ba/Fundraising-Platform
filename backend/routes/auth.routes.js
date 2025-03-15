import express from "express";
import {
  processLogin,
  processLogout,
  processSignup,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", processSignup);
router.post("/login", processLogin);
router.post("/logout", processLogout);
router.post("/refresh-token", refreshToken);

export default router;
