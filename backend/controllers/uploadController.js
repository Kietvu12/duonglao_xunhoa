import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Determine file type
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const videoExtensions = /\.(mp4|mov|avi|wmv|flv|webm)$/i;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let loai = 'anh';
    if (videoExtensions.test(fileExt)) {
      loai = 'video';
    } else if (!imageExtensions.test(fileExt)) {
      loai = 'anh'; // default to image
    }

    // Create URL - automatically detect from request
    // Use BASE_URL from env if set, otherwise construct from request
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      // Detect protocol from request (support proxy headers)
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
      baseUrl = `${protocol}://${host}`;
      
      // Production: use https://duonglaoxuanhoa.net/api_quanlyduonglao
      // Development: use localhost
      if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
        baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
      } else {
        // Local development
        // Remove /api suffix if present
        if (baseUrl.includes('/api')) {
          baseUrl = baseUrl.replace('/api', '');
        }
      }
    }
    // Ensure baseUrl doesn't end with /api
    baseUrl = baseUrl.replace(/\/api\/?$/, '');
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Log for debugging
    console.log('Upload file - Base URL:', baseUrl);
    console.log('Upload file - File URL:', fileUrl);
    console.log('Upload file - Request host:', req.get('host'));
    console.log('Upload file - Request protocol:', req.protocol);
    console.log('Upload file - X-Forwarded-Host:', req.get('x-forwarded-host'));
    console.log('Upload file - X-Forwarded-Proto:', req.get('x-forwarded-proto'));

    res.json({
      success: true,
      message: 'Upload file thành công',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        loai: loai
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Create URL - automatically detect from request
    // Use BASE_URL from env if set, otherwise construct from request
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      // Detect protocol from request (support proxy headers)
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
      baseUrl = `${protocol}://${host}`;
      
      // Production: use https://duonglaoxuanhoa.net/api_quanlyduonglao
      // Development: use localhost
      if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
        baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
      } else {
        // Local development
        // Remove /api suffix if present
        if (baseUrl.includes('/api')) {
          baseUrl = baseUrl.replace('/api', '');
        }
      }
    }
    // Ensure baseUrl doesn't end with /api
    baseUrl = baseUrl.replace(/\/api\/?$/, '');
    
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const videoExtensions = /\.(mp4|mov|avi|wmv|flv|webm)$/i;

    const uploadedFiles = req.files.map(file => {
      const fileExt = path.extname(file.originalname).toLowerCase();
      let loai = 'anh';
      if (videoExtensions.test(fileExt)) {
        loai = 'video';
      }

      return {
        url: `${baseUrl}/uploads/${file.filename}`,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        loai: loai
      };
    });

    res.json({
      success: true,
      message: 'Upload files thành công',
      data: uploadedFiles
    });
  } catch (error) {
    next(error);
  }
};

