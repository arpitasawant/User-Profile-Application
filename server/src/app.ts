import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { signup, verifyOtp, login,resetPassword,getUserInfo} from "./controllers/authController";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/signup", signup);
app.post("/verify-otp", verifyOtp);
app.post("/login", login);
app.post("/reset-password", resetPassword);
app.get("/user-info", getUserInfo);
export default app;
