import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images and documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh hoặc tài liệu'));
  }
};

// File filter for media (images and videos)
const mediaFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpg, png, gif, webp) hoặc video (mp4, mov, avi, wmv, flv, webm)'));
  }
};

// File filter for documents (images and PDF)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp) hoặc PDF'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024 // 20MB
  },
  fileFilter: fileFilter
});

// Upload middleware for media (images and videos) - larger file size
export const uploadMedia = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_MEDIA_SIZE) || 50 * 1024 * 1024 // 50MB default for videos
  },
  fileFilter: mediaFilter
});

// Upload middleware for documents (images and PDF) - for employee profile documents
export const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_DOCUMENT_SIZE) || 20 * 1024 * 1024 // 20MB default for documents
  },
  fileFilter: documentFilter
});

