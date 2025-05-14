import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import orphanageRouter from "./routes/orphanage.routes.js";
import orphanRouter from "./routes/orphan.routes.js";
import campaignRouter from "./routes/campaign.routes.js";
import cartRouter from "./routes/cart.routes.js";
import donationRouter from "./routes/donation.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Set the views directory
app.set("views", "frontend/views");
app.get("/", (req, res) => res.render("homepage.ejs"));
app.get("/login", (req, res) => res.render("login.ejs"));
app.get("/signup", (req, res) => res.render("signup.ejs"));
app.get("/opportunities", (req, res) => res.render("opportunities.ejs"));
app.get("/orphanages", (req, res) => res.send("orphanages.ejs"));
app.get("/cart", (req, res) => res.render("cart.ejs"));
app.get("/case", (req, res) => res.render("case.ejs"));

// Middlewares
app.use(express.static("frontend/public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 30, // Session expiration in MongoDB (30 day in seconds)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiration (30 day in milliseconds)
      httpOnly: isProduction, // Prevents client-side JavaScript access
      secure: false, // Set to true if using HTTPS
    },
  })
);
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/orphanage", orphanageRouter);
app.use("/api/orphan", orphanRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/cart", cartRouter);
app.use("/api/donation", donationRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
