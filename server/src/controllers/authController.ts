import { Request, Response } from "express";
import { User } from "../models/userModel";
import { generateOtp } from "../utils/generateOtp";
import { sendOtp } from "../services/emailService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes

    const user = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      otp,
      otpExpiry,
      isVerified: false,
      contactMode,
      
    });

    await user.save();
    // if (contactMode.email) {
    //   await sendOtp(email, otp);
    // }
    await sendOtp(email, otp);
    res.status(201).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Failed to sign up. Please try again." });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    console.log('Received email:', email); // Log email received
    const user = await User.findOne({ email });

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
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Failed to verify OTP. Please try again." });
  }
};

  
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User is not verified." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password." });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!, // The secret should be stored in an environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Failed to log in. Please try again." });
  }
};



export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Email, current password, and new password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid current password." });
    }

    // Check if the new password is the same as the current password
    const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, user.password);

    if (isNewPasswordSameAsCurrent) {
      return res.status(400).json({ error: "New password must be different from the current password." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
};


export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId).select('firstName lastName email contactMode isVerified');

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
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

