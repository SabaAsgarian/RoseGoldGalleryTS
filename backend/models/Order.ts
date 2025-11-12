import mongoose, { Document, Schema, Model } from "mongoose";

/* =====================
   1️⃣ Define TypeScript Interfaces
   ===================== */
export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  img?: string;
}

export interface IShippingAddress {
  city: string;
  street: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "processing" | "completed" | "cancelled";
  shippingAddress: IShippingAddress;
  trackingCode: string;
  createdAt: Date;
  updatedAt: Date;
}

/* =====================
   2️⃣ Create Schema
   ===================== */
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        img: { type: String }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "processing", "completed", "cancelled"],
      default: "pending"
    },
    shippingAddress: {
      city: { type: String, required: true },
      street: { type: String, required: true }
    },
    trackingCode: {
      type: String,
      default: () =>
        Math.random().toString(36).substring(2, 15).toUpperCase()
    }
  },
  { timestamps: true }
);

/* =====================
   3️⃣ Create & Export Model
   ===================== */
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
