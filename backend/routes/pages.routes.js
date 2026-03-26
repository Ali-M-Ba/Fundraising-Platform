import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.render("pages/homepage.ejs"));
router.get("/login", (req, res) => res.render("auth/login.ejs"));
router.get("/signup", (req, res) => res.render("auth/signup.ejs"));
router.get("/opportunities", (req, res) =>
  res.render("pages/opportunities.ejs"),
);
router.get("/orphanages", (req, res) => res.render("pages/orphanages.ejs"));
router.get("/orphanage", (req, res) => res.render("pages/orphanage.ejs"));
router.get("/cart", (req, res) => res.render("pages/cart.ejs"));
router.get("/case", (req, res) => res.render("pages/case.ejs"));
router.get("/donations", (req, res) => res.render("pages/donations.ejs"));
router.get("/success-donation", (req, res) =>
  res.render("pages/success-donation.ejs"),
);

export default router;
