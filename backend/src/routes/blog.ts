import express from 'express';
import { supabase } from '../index';

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get blog posts by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching blog posts with category ${category}:`, error);
    res.status(500).json({ error: 'Failed to fetch blog posts by category' });
  }
});

// Get recent blog posts (limit to specific number)
router.get('/recent/:limit', async (req, res) => {
  const limit = parseInt(req.params.limit) || 3;

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch recent blog posts' });
  }
});

export default router;