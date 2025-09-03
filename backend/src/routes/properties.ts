import express from 'express';
import { supabase } from '../index';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get featured properties
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ error: 'Failed to fetch featured properties' });
  }
});

// Get single property by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching property with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Filter properties
router.get('/filter', async (req, res) => {
  const { type, minPrice, maxPrice, bedrooms, bathrooms, location } = req.query;

  try {
    let query = supabase.from('properties').select('*');

    if (type) {
      query = query.eq('type', type);
    }

    if (minPrice) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    if (bedrooms) {
      query = query.gte('bedrooms', bedrooms);
    }

    if (bathrooms) {
      query = query.gte('bathrooms', bathrooms);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error filtering properties:', error);
    res.status(500).json({ error: 'Failed to filter properties' });
  }
});

export default router;