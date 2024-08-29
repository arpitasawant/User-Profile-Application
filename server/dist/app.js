"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authController_1 = require("./controllers/authController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.post("/signup", authController_1.signup);
app.post("/verify-otp", authController_1.verifyOtp);
app.post("/login", authController_1.login);
app.post("/reset-password", authController_1.resetPassword);
app.get("/user-info", authController_1.getUserInfo);
exports.default = app;
