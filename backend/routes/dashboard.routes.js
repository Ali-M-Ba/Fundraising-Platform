import express from "express";

const router = express.Router();

// Dashboard
router.get("/", (req, res) => res.render("dashboard/dashboard.overview.ejs"));
router.get("/overview", (req, res) =>
  res.render("dashboard/dashboard.overview.ejs"),
);
router.get("/orphanages", (req, res) =>
  res.render("dashboard/orphanages/dashboard.orphanages.ejs"),
);
router.get("/orphanages/create", (req, res) =>
  res.render("dashboard/orphanages/dashboard.orphanages.create.ejs"),
);
router.get("/orphanages/edit/:id", (req, res) =>
  res.render("dashboard/orphanages/dashboard.orphanages.edit.ejs"),
);
router.get("/orphans/edit/:id", (req, res) =>
  res.render("dashboard/orphans/dashboard.orphans.edit.ejs"),
);
router.get("/campaigns/edit/:id", (req, res) =>
  res.render("dashboard/campaigns/dashboard.campaigns.edit.ejs"),
);
router.get("/donations", (req, res) =>
  res.render("dashboard/donations/dashboard.donations.ejs"),
);
router.get("/sponsorships", (req, res) =>
  res.render("dashboard/sponsorships/dashboard.sponsorships.ejs"),
);
router.get("/orphans", (req, res) =>
  res.render("dashboard/orphans/dashboard.orphans.ejs"),
);
router.get("/campaigns", (req, res) =>
  res.render("dashboard/campaigns/dashboard.campaigns.ejs"),
);
router.get("/users", (req, res) =>
  res.render("dashboard/users/dashboard.users.ejs"),
);
router.get("/users/create", (req, res) =>
  res.render("dashboard/users/dashboard.users.create.ejs"),
);
router.get("/orphans/create", (req, res) =>
  res.render("dashboard/orphans/dashboard.orphans.create.ejs"),
);
router.get("/campaigns/create", (req, res) =>
  res.render("dashboard/campaigns/dashboard.campaigns.create.ejs"),
);

export default router;
