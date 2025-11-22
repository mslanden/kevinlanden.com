import express from 'express';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// GET all Best in Show items (public - only active items)
router.get('/', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('best_in_show_items')
      .select('*')
      .eq('is_active', true)
      .order('section', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching best in show items:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }

    // Group items by section for easier frontend consumption
    const groupedItems = {
      photography: items?.filter(item => item.section === 'photography') || [],
      'virtual-staging': items?.filter(item => item.section === 'virtual-staging') || [],
      'item-removal': items?.filter(item => item.section === 'item-removal') || [],
      'sky-lawn-replacement': items?.filter(item => item.section === 'sky-lawn-replacement') || [],
      '3d-tours': items?.filter(item => item.section === '3d-tours') || []
    };

    res.json(groupedItems);
  } catch (error) {
    console.error('Error in GET /best-in-show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all Best in Show items (admin - all items including inactive)
router.get('/admin/all', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: items, error } = await supabaseAdmin
      .from('best_in_show_items')
      .select('*')
      .order('section', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all best in show items:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }

    // Group items by section for easier frontend consumption
    const groupedItems = {
      photography: items?.filter(item => item.section === 'photography') || [],
      'virtual-staging': items?.filter(item => item.section === 'virtual-staging') || [],
      'item-removal': items?.filter(item => item.section === 'item-removal') || [],
      'sky-lawn-replacement': items?.filter(item => item.section === 'sky-lawn-replacement') || [],
      '3d-tours': items?.filter(item => item.section === '3d-tours') || []
    };

    res.json(groupedItems);
  } catch (error) {
    console.error('Error in GET /best-in-show/admin/all:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single Best in Show item by ID (admin)
router.get('/:id', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabaseAdmin
      .from('best_in_show_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching best in show item:', error);
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error in GET /best-in-show/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new Best in Show item (admin)
router.post('/', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      section,
      item_type,
      title,
      description,
      image_url,
      image_url_before,
      embed_url,
      display_order,
      is_active
    } = req.body;

    // Validate required fields
    if (!section || !item_type || !title) {
      return res.status(400).json({ error: 'Missing required fields: section, item_type, title' });
    }

    // Validate section values
    const validSections = ['photography', 'virtual-staging', 'item-removal', 'sky-lawn-replacement', '3d-tours'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ error: 'Invalid section value' });
    }

    // Validate item_type values
    const validItemTypes = ['gallery-item', 'before-after', '360-viewer', 'iframe-embed'];
    if (!validItemTypes.includes(item_type)) {
      return res.status(400).json({ error: 'Invalid item_type value' });
    }

    const { data: item, error } = await supabaseAdmin
      .from('best_in_show_items')
      .insert([{
        section,
        item_type,
        title,
        description,
        image_url,
        image_url_before,
        embed_url,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating best in show item:', error);
      return res.status(500).json({ error: 'Failed to create item' });
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('Error in POST /best-in-show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update Best in Show item (admin)
router.put('/:id', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      section,
      item_type,
      title,
      description,
      image_url,
      image_url_before,
      embed_url,
      display_order,
      is_active
    } = req.body;

    // Validate section if provided
    if (section) {
      const validSections = ['photography', 'virtual-staging', 'item-removal', '3d-tours'];
      if (!validSections.includes(section)) {
        return res.status(400).json({ error: 'Invalid section value' });
      }
    }

    // Validate item_type if provided
    if (item_type) {
      const validItemTypes = ['gallery-item', 'before-after', '360-viewer', 'iframe-embed'];
      if (!validItemTypes.includes(item_type)) {
        return res.status(400).json({ error: 'Invalid item_type value' });
      }
    }

    const updateData: any = {};
    if (section !== undefined) updateData.section = section;
    if (item_type !== undefined) updateData.item_type = item_type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (image_url_before !== undefined) updateData.image_url_before = image_url_before;
    if (embed_url !== undefined) updateData.embed_url = embed_url;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: item, error } = await supabaseAdmin
      .from('best_in_show_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating best in show item:', error);
      return res.status(500).json({ error: 'Failed to update item' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error in PUT /best-in-show/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE Best in Show item (admin)
router.delete('/:id', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('best_in_show_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting best in show item:', error);
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /best-in-show/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH update display order for multiple items (admin)
router.patch('/reorder', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, display_order }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    // Update each item's display order
    const updatePromises = items.map(({ id, display_order }) =>
      supabaseAdmin
        .from('best_in_show_items')
        .update({ display_order })
        .eq('id', id)
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Display order updated successfully' });
  } catch (error) {
    console.error('Error in PATCH /best-in-show/reorder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
