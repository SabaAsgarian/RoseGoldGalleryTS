import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

// ✅ Configure storage
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, "uploads/"); // Save files inside "uploads" folder
  },
  filename: (_req: Request, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ✅ Multer instance
const upload = multer({ storage });

// ✅ Export for use in routes
export default upload;
