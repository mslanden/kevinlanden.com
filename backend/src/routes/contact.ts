import express, { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { validate, schemas, sanitizeForDb } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { contactLimiter } from '../middleware/rateLimiter';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Submit contact form with rate limiting
router.post('/', 
  contactLimiter,
  validate(schemas.contactSubmission), 
  asyncHandler(async (req: Request, res: Response) => {
    const sanitizedData = sanitizeForDb(req.body);
    const { name, email, phone, subject, message } = sanitizedData;

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        subject,
        message,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        submitted_at: new Date().toISOString()
      })
      .select('id, name, email, subject, created_at');

    if (error) {
      throw new Error(`Contact submission failed: ${error.message}`);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
      data: {
        id: data[0].id,
        submittedAt: data[0].created_at
      }
    });
  })
);

// Get all contact submissions (admin only)
router.get('/submissions', 
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch contact submissions: ${error.message}`);
    }

    res.json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  })
);

// Mark contact submission as read (admin only)
router.patch('/submissions/:id/read',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ 
        read: true,
        read_at: new Date().toISOString(),
        read_by: req.user?.id
      })
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to mark submission as read: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact submission marked as read',
      data: data[0]
    });
  })
);

// Delete contact submission (admin only)
router.delete('/submissions/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to delete contact submission: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  })
);

export default router;