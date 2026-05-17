import path from 'path';
import fs from 'fs';
import os from 'os';

const uploadDir = path.join(os.tmpdir(), 'uploads');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { filename } = req.query;
  if (!filename) {
    res.status(400).json({ message: '缺少文件名参数' });
    return;
  }

  const safeName = path.basename(filename);
  const filePath = path.join(uploadDir, safeName);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: '文件不存在' });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}
