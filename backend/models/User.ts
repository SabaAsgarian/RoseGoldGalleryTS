import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  id?: string;
  fname: string;
  lname: string;
  email: string;
  mobile: string;
  pass: string;
  img?: string;
  city: string;
  street: string;
  age: number;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<IUser>(
  {
    id: { type: String },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    img: { type: String, default: "" },
    city: { type: String, required: true },
    street: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

// Instance methods
userSchema.methods.comparePassword = async function (this: IUser, candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.pass);
};

// Export model
export const User = model<IUser>("User", userSchema);
