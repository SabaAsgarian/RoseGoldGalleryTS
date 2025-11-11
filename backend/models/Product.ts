import { Schema, model, Document } from "mongoose";

// Product interface
export interface IProduct extends Document {
  img?: string;
  title: string;
  price: number;
  weight?: string;
  description?: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema definition
const productSchema = new Schema<IProduct>(
  {
    img: { type: String, default: "" }, // مسیر عکس ذخیره می‌شود
    title: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String, default: "0" },
    description: { type: String, default: "" },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

// Export model
export const Product = model<IProduct>("Product", productSchema);
