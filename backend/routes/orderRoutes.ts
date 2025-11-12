import express, { Request, Response } from "express";
import Order, { IOrder, IOrderItem } from "../models/Order";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: string };
  }
}

// --------------------
// 📌 Get all orders (Admin only)
// --------------------
router.get("/all", authMiddleware, async (req: Request, res: Response) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });
  }

  try {
    const orders = await Order.find()
      .populate("userId", "fname lname email street city")
      .exec();

    res.json(orders);
  } catch (error: any) {
    console.error("Error fetching all orders:", error.message);
    res.status(500).json({
      error: "❌ دریافت سفارشات ادمین ناموفق بود.",
      details: error.message,
    });
  }
});

// --------------------
// 📌 Get a single order by ID
// --------------------
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "fname lname email street city"
    );
    if (!order) return res.status(404).json({ error: "سفارش یافت نشد" });

    res.json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "❌ خطا در دریافت اطلاعات سفارش" });
  }
});

// --------------------
// 📌 Create new order
// --------------------
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "سبد خرید نامعتبر است" });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "مبلغ کل نامعتبر است" });
    }
    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({ error: "آدرس حمل و نقل نامعتبر است" });
    }

    const orderItems: IOrderItem[] = items.map((item: any) => ({
      id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      img: item.img,
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      trackingCode: Math.random().toString(36).substring(2, 15).toUpperCase(),
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      orderId: newOrder._id,
      trackingCode: newOrder.trackingCode,
    });
  } catch (error: any) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ error: "خطا در ثبت سفارش", details: error.message });
  }
});

// --------------------
// 📌 Get orders of the authenticated user
// --------------------
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error: any) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "❌ دریافت سفارشات ناموفق بود." });
  }
});

// --------------------
// 📌 Update order (Admin only)
// --------------------
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });

  try {
    const updateData: Partial<IOrder> = {};

    if (req.body.status) updateData.status = req.body.status;

    if (req.body.shippingAddress) {
      const { city, street } = req.body.shippingAddress;
      if (!city || !street) {
        return res.status(400).json({ error: "آدرس حمل و نقل نامعتبر است" });
      }
      updateData.shippingAddress = { city: city.trim(), street: street.trim() };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "هیچ داده‌ای برای بروزرسانی ارسال نشده است" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("userId", "fname lname email street city");

    if (!updatedOrder) return res.status(404).json({ error: "سفارش یافت نشد" });

    res.json({ success: true, message: "✅ سفارش بروزرسانی شد", order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "❌ خطا در بروزرسانی سفارش", details: error.message });
  }
});

// --------------------
// 📌 Update shipping address for all orders of user
// --------------------
router.put("/update-address/all", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "User not authenticated" });

    if (!shippingAddress || !shippingAddress.city || !shippingAddress.street) {
      return res.status(400).json({ error: "آدرس حمل و نقل نامعتبر است" });
    }

    const result = await Order.updateMany(
      { userId },
      { $set: { shippingAddress: { city: shippingAddress.city.trim(), street: shippingAddress.street.trim() } } }
    );

    res.json({
      success: true,
      message: "✅ آدرس در تمام سفارش‌ها به‌روزرسانی شد",
      updatedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("Error updating shipping addresses:", error.message);
    res.status(500).json({ error: "❌ خطا در به‌روزرسانی آدرس‌ها", details: error.message });
  }
});

// --------------------
// 📌 Delete order (Admin only)
// --------------------
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "❌ دسترسی غیرمجاز" });

  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ سفارش با موفقیت حذف شد" });
  } catch (error: any) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ error: "❌ حذف سفارش ناموفق بود." });
  }
});

export default router;
