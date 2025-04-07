import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import orphanageRouter from "./routes/orphanage.routes.js";
import orphanRouter from "./routes/orphan.routes.js";
import campaignRouter from "./routes/campaign.routes.js";
import cartRouter from "./routes/cart.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Middlewares
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
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/orphanage", orphanageRouter);
app.use("/orphan", orphanRouter);
app.use("/campaign", campaignRouter);
app.use("/cart", cartRouter);

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
