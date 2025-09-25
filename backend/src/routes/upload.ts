import express from 'express';
import multer from 'multer';
import { supabase } from '../utils/supabaseClient';
import { randomUUID } from 'crypto';
import path from 'path';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer with file size limit and filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const uuid = randomUUID();
  const timestamp = Date.now();
  return `${timestamp}-${uuid}${ext}`;
}

// Helper function to get file path in bucket
function getFilePath(category: string, filename: string): string {
  return `${category}/${filename}`;
}

// Upload single image
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { category = 'general' } = req.body;
    const filename = generateFileName(req.file.originalname);
    const filePath = getFilePath(category, filename);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const { category = 'general' } = req.body;
    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const filename = generateFileName(file.originalname);
      const filePath = getFilePath(category, filename);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      return {
        path: data.path,
        publicUrl: urlData.publicUrl,
        filename: filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: uploadResults,
      count: uploadResults.length
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to upload images' });
  }
});

// Delete image
router.delete('/image', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const { error } = await supabase.storage
      .from('listing-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Internal server error during deletion' });
  }
});

// Delete multiple images
router.delete('/images', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { paths } = req.body;

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return res.status(400).json({ error: 'File paths array is required' });
    }

    const { error } = await supabase.storage
      .from('listing-images')
      .remove(paths);

    if (error) {
      console.error('Multiple delete error:', error);
      return res.status(500).json({ error: 'Failed to delete images' });
    }

    res.json({
      success: true,
      message: `${paths.length} images deleted successfully`,
      count: paths.length
    });

  } catch (error) {
    console.error('Multiple delete error:', error);
    res.status(500).json({ error: 'Internal server error during deletion' });
  }
});

// Get image info (for debugging/admin purposes)
router.get('/info/:path(*)', async (req, res) => {
  try {
    const filePath = req.params.path;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    // Get file info from Supabase Storage
    const { data, error } = await supabase.storage
      .from('listing-images')
      .list(path.dirname(filePath), {
        search: path.basename(filePath)
      });

    if (error) {
      console.error('File info error:', error);
      return res.status(500).json({ error: 'Failed to get file info' });
    }

    const fileInfo = data.find(file => file.name === path.basename(filePath));

    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      data: {
        ...fileInfo,
        publicUrl: urlData.publicUrl,
        fullPath: filePath
      }
    });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware for multer errors
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 10 files per request.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name for file upload.' });
    }
  }

  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' });
  }

  next(error);
});

export default router;