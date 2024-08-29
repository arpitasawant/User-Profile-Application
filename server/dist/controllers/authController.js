"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.resetPassword = exports.login = exports.verifyOtp = exports.signup = void 0;
const userModel_1 = require("../models/userModel");
const generateOtp_1 = require("../utils/generateOtp");
const emailService_1 = require("../services/emailService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOtp();
//     const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
//     const user = new User({
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpiry,
//       isVerified: false,
//     });
//     await user.save();
//     await sendOtp(email, otp);
//     res.status(201).json({ message: "OTP sent to your email." });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ error: "Failed to sign up. Please try again." });
//   }
// };
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { firstName, lastName, password, confirmPassword, contactMode } = req.body;
//     // Ensure passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match." });
//     }
//     // Custom validation for contactMode
//     if ((!contactMode.email && !contactMode.mobile) || (contactMode.email && contactMode.mobile)) {
//       return res.status(400).json({ error: "Exactly one of email or mobile must be provided." });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOtp();
//     const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
//     const user = new User({
//       firstName,
//       lastName,
//       password: hashedPassword,
//       otp,
//       otpExpiry,
//       isVerified: false,
//       contactMode,
//     });
//     await user.save();
//     await sendOtp(contactMode.email, otp);
//     res.status(201).json({ message: "OTP sent to your email." });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ error: "Failed to sign up. Please try again." });
//   }
// };
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, confirmPassword, contactMode, email } = req.body;
        // Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }
        // Custom validation for contactMode
        if ((!contactMode.email && !contactMode.mobile) || (contactMode.email && contactMode.mobile)) {
            return res.status(400).json({ error: "Exactly one of email or mobile must be provided." });
        }
        // Validate email if it's used for OTP
        if (contactMode.email && !email) {
            return res.status(400).json({ error: "Email is required for OTP validation." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const otp = (0, generateOtp_1.generateOtp)();
        const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
        const user = new userModel_1.User({
            firstName,
            lastName,
            password: hashedPassword,
            email,
            otp,
            otpExpiry,
            isVerified: false,
            contactMode,
            // Set email only if provided
        });
        yield user.save();
        // if (contactMode.email) {
        //   await sendOtp(email, otp);
        // }
        yield (0, emailService_1.sendOtp)(email, otp);
        res.status(201).json({ message: "OTP sent to your email." });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Failed to sign up. Please try again." });
    }
});
exports.signup = signup;
// export const verifyOtp = async (req: Request, res: Response) => {
//     try {
//       const { email, otp } = req.body;
//       if (!email || !otp) {
//         return res.status(400).json({ error: "Email and OTP are required." });
//       }
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(400).json({ error: "User not found." });
//       }
//       // Debugging lines
//       // console.log("User fetched from DB:", user);
//       // console.log("Received OTP:", otp);
//       // console.log("User OTP from DB:", user.otp);
//       // console.log("OTP Expiry from DB:", user.otpExpiry);
//       if (user.isVerified) {
//         return res.status(400).json({ error: "User is already verified." });
//       }
//       if (user.otp !== otp) {
//         return res.status(400).json({ error: "Invalid OTP." });
//       }
//       if (user.otpExpiry < new Date()) {
//         return res.status(400).json({ error: "OTP has expired." });
//       }
//       // OTP is valid and not expired
//       user.isVerified = true;
//       user.otp = ""; // clear OTP
//       await user.save();
//       res.status(200).json({ message: "OTP verified successfully." });
//     } catch (error) {
//       console.error("OTP Verification Error:", error);
//       res.status(500).json({ error: "Failed to verify OTP. Please try again." });
//     }
//   };
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required." });
        }
        console.log('Received email:', email); // Log email received
        const user = yield userModel_1.User.findOne({ email });
        console.log('User fetched from DB:', user); // Log user fetched from DB
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: "User is already verified." });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP." });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ error: "OTP has expired." });
        }
        user.isVerified = true;
        user.otp = ""; // clear OTP
        yield user.save();
        res.status(200).json({ message: "OTP verified successfully." });
    }
    catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ error: "Failed to verify OTP. Please try again." });
    }
});
exports.verifyOtp = verifyOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }
        if (!user.isVerified) {
            return res.status(400).json({ error: "User is not verified." });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password." });
        }
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, // The secret should be stored in an environment variable
        { expiresIn: "1h" } // Token expires in 1 hour
        );
        res.status(200).json({ message: "Login successful.", token });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Failed to log in. Please try again." });
    }
});
exports.login = login;
// reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, currentPassword, newPassword } = req.body;
        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Email, current password, and new password are required." });
        }
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid current password." });
        }
        // Check if the new password is the same as the current password
        const isNewPasswordSameAsCurrent = yield bcrypt_1.default.compare(newPassword, user.password);
        if (isNewPasswordSameAsCurrent) {
            return res.status(400).json({ error: "New password must be different from the current password." });
        }
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedNewPassword;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully." });
    }
    catch (error) {
        console.error("Password Reset Error:", error);
        res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
});
exports.resetPassword = resetPassword;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = yield userModel_1.User.findById(userId).select('firstName lastName email contactMode isVerified');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactMode: user.contactMode,
            isVerified: user.isVerified
        });
    }
    catch (error) {
        console.error("Error fetching user information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserInfo = getUserInfo;
