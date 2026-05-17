import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

const uploadDir = path.join(os.tmpdir(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  upload.single('image')(req, res, function (err) {
    if (err) {
      res.status(500).json({ message: '图片上传失败' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: '没有文件被上传' });
      return;
    }
    res.status(200).json({
      message: '图片上传成功',
      imageUrl: `/api/uploads/${req.file.filename}`,
    });
  });
}
