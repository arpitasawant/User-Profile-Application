import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string; // Optional email field
  password: string;
  contactMode: {
    email?: string;
    mobile?: string;
  };
  otp: string;
  otpExpiry: Date;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String,  required: true,unique: true},
  password: { type: String, required: true },
  contactMode: {
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
  },
  otp: { type: String },
  otpExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", UserSchema);
