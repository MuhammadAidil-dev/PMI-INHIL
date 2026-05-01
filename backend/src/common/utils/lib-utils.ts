import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ─── Auto-create upload directory if not exists ───────────────────────────────
const uploadDir = path.join(process.cwd(), 'uploads', 'news');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Multer Config ────────────────────────────────────────────────────────────

export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `news-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  },
});

export const deleteImageFile = (imageUrl: string) => {
  if (!imageUrl) return;

  const absolutePath = path.join(process.cwd(), 'public', imageUrl);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};
