import express from "express";
import {
  addToCart,
  clearCart,
  getCartItems,
  removeItem,
  updateAmount,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getCartItems);
router.post("/", addToCart);
router.put("/:id", updateAmount);
router.delete("/:id", removeItem);
router.delete("/", clearCart);

export default router;
