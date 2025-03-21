import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import orphanageRouter from "./routes/orphanage.routes.js";
import orphanRouter from "./routes/orphan.routes.js";
import campaignRouter from "./routes/campaign.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/orphanage", orphanageRouter);
app.use("/orphan", orphanRouter);
app.use("/campaign", campaignRouter);

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
