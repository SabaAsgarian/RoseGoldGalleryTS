// src/models/Admin.ts
import { Schema, model, Document, Types } from "mongoose";

// Define the Admin interface extending mongoose.Document
export interface IAdmin extends Document {
  _id: Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  pass: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the schema with type safety
const adminSchema = new Schema<IAdmin>(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    role: { type: String, default: "admin" }, // نقش پیش‌فرض ادمین است
  },
  { timestamps: true }
);

// Export the model with proper typing
export const Admin = model<IAdmin>("Admin", adminSchema);
