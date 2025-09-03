import express, { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { validate, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { adminLimiter } from '../middleware/rateLimiter';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get current blowout sale status (public endpoint)
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('blowout_sale')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch blowout sale status: ${error.message}`);
  }

  if (!data) {
    // Return default values if no active sale found
    return res.json({
      spotsRemaining: 0,
      totalSpots: 25,
      isActive: false,
      message: 'No active blowout sale currently running'
    });
  }

  res.json({
    success: true,
    spotsRemaining: data.spots_remaining,
    totalSpots: data.total_spots,
    isActive: data.is_active,
    lastUpdated: data.updated_at
  });
}));

// Claim a spot (decrement spots_remaining)
router.post('/claim-spot', async (req, res) => {
  try {
    // First get the current sale
    const { data: currentSale, error: fetchError } = await supabase
      .from('blowout_sale')
      .select('*')
      .eq('is_active', true)
      .single();

    if (fetchError || !currentSale) {
      return res.status(404).json({ message: 'No active blowout sale found' });
    }

    if (currentSale.spots_remaining <= 0) {
      return res.status(400).json({ message: 'No spots remaining' });
    }

    // Update the spots remaining
    const { data, error } = await supabase
      .from('blowout_sale')
      .update({ 
        spots_remaining: currentSale.spots_remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSale.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      spotsRemaining: data.spots_remaining,
      message: 'Spot successfully claimed'
    });
  } catch (error) {
    console.error('Error claiming spot:', error);
    res.status(500).json({ error: 'Failed to claim spot' });
  }
});

// Admin endpoint to update blowout sale
router.put('/update', 
  authenticateToken,
  requireAdmin,
  adminLimiter,
  validate(schemas.blowoutSaleUpdate),
  asyncHandler(async (req: Request, res: Response) => {
    const { total_spots, spots_remaining, is_active } = req.body;

    // Get current active sale
    const { data: currentSale } = await supabase
      .from('blowout_sale')
      .select('*')
      .eq('is_active', true)
      .single();

    let result;

    if (currentSale) {
      // Update existing sale
      const updateData: any = { 
        updated_at: new Date().toISOString(),
        updated_by: req.user?.id
      };
      
      if (total_spots !== undefined) updateData.total_spots = total_spots;
      if (spots_remaining !== undefined) updateData.spots_remaining = spots_remaining;
      if (is_active !== undefined) updateData.is_active = is_active;

      const { data, error } = await supabase
        .from('blowout_sale')
        .update(updateData)
        .eq('id', currentSale.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update blowout sale: ${error.message}`);
      }
      result = data;
    } else {
      // Create new sale if none exists
      const { data, error } = await supabase
        .from('blowout_sale')
        .insert({
          total_spots: total_spots || 25,
          spots_remaining: spots_remaining || 25,
          is_active: is_active !== undefined ? is_active : true,
          created_by: req.user?.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create blowout sale: ${error.message}`);
      }
      result = data;
    }

    res.json({
      success: true,
      data: {
        id: result.id,
        totalSpots: result.total_spots,
        spotsRemaining: result.spots_remaining,
        isActive: result.is_active,
        updatedAt: result.updated_at
      },
      message: 'Blowout sale updated successfully'
    });
  })
);

// Admin endpoint to reset blowout sale
router.post('/reset', 
  authenticateToken,
  requireAdmin,
  adminLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { total_spots = 25 } = req.body;

    // Validate total_spots
    if (total_spots < 1 || total_spots > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Total spots must be between 1 and 1000'
      });
    }

    // Deactivate all existing sales
    await supabase
      .from('blowout_sale')
      .update({ 
        is_active: false,
        deactivated_at: new Date().toISOString(),
        deactivated_by: req.user?.id
      })
      .eq('is_active', true);

    // Create new sale
    const { data, error } = await supabase
      .from('blowout_sale')
      .insert({
        total_spots,
        spots_remaining: total_spots,
        is_active: true,
        created_by: req.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to reset blowout sale: ${error.message}`);
    }

    res.json({
      success: true,
      data: {
        id: data.id,
        totalSpots: data.total_spots,
        spotsRemaining: data.spots_remaining,
        isActive: data.is_active,
        createdAt: data.created_at
      },
      message: 'Blowout sale reset successfully'
    });
  })
);

export default router;