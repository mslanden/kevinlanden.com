import express, { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { validate, schemas, sanitizeForDb } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { contactLimiter } from '../middleware/rateLimiter';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { loftyCRM } from '../services/loftyCRM';

const router = express.Router();

// Submit contact form with rate limiting
router.post('/', 
  contactLimiter,
  validate(schemas.contactSubmission), 
  asyncHandler(async (req: Request, res: Response) => {
    const sanitizedData = sanitizeForDb(req.body);
    const { name, email, phone, subject, message, leadType } = sanitizedData;

    // Save to database first
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        subject,
        message,
        lead_type: leadType || 'buyer',
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        submitted_at: new Date().toISOString()
      })
      .select('id, name, email, subject, created_at');

    if (error) {
      throw new Error(`Contact submission failed: ${error.message}`);
    }

    // Send to Lofty CRM (non-blocking - don't fail if CRM is down)
    loftyCRM.createLead({
      name,
      email,
      phone,
      subject,
      message,
      leadType
    }).then(async (result) => {
      if (result.success) {
        console.log(`Contact form lead sent to Lofty CRM: ${result.leadId}`);
        // Optionally update the database record with the CRM lead ID
        if (result.leadId && data[0].id) {
          try {
            const { error: updateError } = await supabase
              .from('contact_submissions')
              .update({ crm_lead_id: result.leadId })
              .eq('id', data[0].id);
            
            if (updateError) {
              console.error('Failed to update CRM lead ID:', updateError);
            } else {
              console.log('Updated contact submission with CRM lead ID');
            }
          } catch (err) {
            console.error('Failed to update CRM lead ID:', err);
          }
        }
      } else {
        console.warn('Failed to send lead to Lofty CRM:', result.error);
      }
    }).catch((err: any) => {
      console.error('Error sending to Lofty CRM:', err);
    });

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