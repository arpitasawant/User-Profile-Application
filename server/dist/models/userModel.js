"use strict";
// import mongoose, { Document, Schema } from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// export interface IUser extends Document {
//   email: string;
//   password: string;
//   otp: string;
//   otpExpiry: Date;
//   isVerified: boolean;
// }
// const UserSchema: Schema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   otp: { type: String },
//   otpExpiry: { type: Date, required: true },
//   isVerified: { type: Boolean, default: false },
// });
// export const User = mongoose.model<IUser>("User", UserSchema);
// import mongoose, { Document, Schema } from "mongoose";
// export interface IUser extends Document {
//   firstName: string;
//   lastName: string;
//   email: string; // Separate email field
//   password: string;
//   confirmPassword: string;
//   contactMode: {
//     email?: string;
//     mobile?: string;
//   };
//   otp: string;
//   otpExpiry: Date;
//   isVerified: boolean;
// }
// const UserSchema: Schema = new Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true }, // Separate email field
//   password: { type: String, required: true },
//   confirmPassword: { type: String, required: true },
//   contactMode: {
//     email: { type: String, unique: true, sparse: true },
//     mobile: { type: String, unique: true, sparse: true },
//   },
//   otp: { type: String },
//   otpExpiry: { type: Date, required: true },
//   isVerified: { type: Boolean, default: false },
// });
// export const User = mongoose.model<IUser>("User", UserSchema);
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactMode: {
        email: { type: String, unique: true, sparse: true },
        mobile: { type: String, unique: true, sparse: true },
    },
    otp: { type: String },
    otpExpiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
});
exports.User = mongoose_1.default.model("User", UserSchema);
