import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import {Product, IProduct } from "../models/Product";

const router = express.Router();

// --------------------
// Multer storage config
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ذخیره فایل‌ها در پوشه uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // تغییر نام فایل
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // فقط فایل‌های تصویری مجاز
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("فرمت فایل مجاز نیست"));
};

const upload = multer({ storage, fileFilter });

// --------------------
// Get all products
// --------------------
router.get("/", async (req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find();
    res.json(products);
  } catch (err: any) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "خطا در دریافت محصولات", error: err.message });
  }
});

// --------------------
// Get products by category
// --------------------
router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products: IProduct[] = await Product.find({ category });
    res.json(products);
  } catch (err: any) {
    console.error("Error fetching category products:", err.message);
    res.status(500).json({ message: "خطا در دریافت محصولات", error: err.message });
  }
});

// --------------------
// Add new product + image upload
// --------------------
router.post("/products", upload.single("img"), async (req: Request, res: Response) => {
  try {
    const { title, price, weight, description, category } = req.body;

    if (!req.file || !title || !price || !weight || !description || !category) {
      return res.status(400).json({ message: "اطلاعات محصول ناقص است!" });
    }

    const newProduct = new Product({
      img: req.file.path,
      title,
      price,
      weight,
      description,
      category,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ محصول با موفقیت ذخیره شد!", product: newProduct });
  } catch (err: any) {
    console.error("Error saving product:", err.message);
    res.status(500).json({ message: "❌ خطا در ذخیره محصول", error: err.message });
  }
});

// --------------------
// Edit product
// --------------------
router.put("/:id", upload.single("img"), async (req: Request, res: Response) => {
  try {
    const updateFields: Partial<IProduct> = { ...req.body };
    if (req.file) {
      updateFields.img = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: "محصول یافت نشد" });

    res.json({ message: "محصول با موفقیت ویرایش شد", product: updatedProduct });
  } catch (err: any) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ message: "خطا در ویرایش محصول", error: err.message });
  }
});

// --------------------
// Delete product
// --------------------
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "محصول یافت نشد" });

    res.json({ message: "محصول حذف شد!" });
  } catch (err: any) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ message: "خطا در حذف محصول", error: err.message });
  }
});

export default router;
