import express from 'express';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import QRCode from 'qrcode';
import slugify from 'slugify';

const router = express.Router();

// Helper function to generate QR code
async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// Helper function to generate unique slug
async function generateUniqueSlug(title: string): Promise<string> {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists and increment if needed
  while (true) {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// GET all listings (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // For admin, return all listings regardless of status
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select(`
        *,
        listing_images (
          id,
          image_url,
          caption,
          display_order,
          is_main
        ),
        listing_kuula_spheres (
          id,
          kuula_id,
          title,
          display_order
        ),
        listing_features (
          id,
          feature,
          category
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return res.status(500).json({ error: 'Failed to fetch listings' });
    }

    res.json(listings || []);
  } catch (error) {
    console.error('Error in GET /listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single listing by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .select(`
        *,
        listing_images (
          id,
          image_url,
          caption,
          display_order,
          is_main
        ),
        listing_kuula_spheres (
          id,
          kuula_id,
          title,
          description,
          display_order
        ),
        listing_features (
          id,
          feature,
          category
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    await supabaseAdmin
      .from('listings')
      .update({ views_count: (listing.views_count || 0) + 1 })
      .eq('id', listing.id);

    res.json(listing);
  } catch (error) {
    console.error('Error in GET /listings/:slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new listing (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('POST /listings - Request body:', JSON.stringify(req.body, null, 2));

    const {
      title,
      description,
      location,
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      lot_size,
      year_built,
      property_type,
      main_image_url,
      zillow_tour_url,
      floor_plan_url,
      status,
      featured,
      images,
      kuula_spheres,
      features
    } = req.body;

    // Validate required fields
    if (!title) {
      console.error('Missing required field: title');
      return res.status(400).json({ error: 'Title is required' });
    }

    console.log('Generating unique slug for title:', title);
    // Generate unique slug
    const slug = await generateUniqueSlug(title);
    console.log('Generated slug:', slug);

    console.log('Generating QR code...');
    // Generate QR code
    const baseUrl = process.env.FRONTEND_URL || 'https://kevinlandenrealestate.com';
    const listingUrl = `${baseUrl}/listing/${slug}`;
    console.log('Listing URL for QR code:', listingUrl);
    const qrCodeDataUrl = await generateQRCode(listingUrl);
    console.log('QR code generated successfully');

    console.log('Inserting main listing into database...');

    // Helper function to convert empty strings to null for numeric fields
    const parseNumeric = (value: any) => {
      if (value === '' || value === null || value === undefined) return null;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    const parseInteger = (value: any) => {
      if (value === '' || value === null || value === undefined) return null;
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    const listingData = {
      slug,
      title,
      description: description || null,
      location: location || null,
      address: address || null,
      city: city || null,
      state: state || 'CA',
      zip_code: zip_code || null,
      price: parseNumeric(price),
      bedrooms: parseInteger(bedrooms),
      bathrooms: parseNumeric(bathrooms),
      square_feet: parseInteger(square_feet),
      lot_size: parseNumeric(lot_size),
      year_built: parseInteger(year_built),
      property_type,
      main_image_url: main_image_url || null,
      zillow_tour_url: zillow_tour_url || null,
      floor_plan_url: floor_plan_url || null,
      qr_code_url: qrCodeDataUrl,
      status: status || 'active',
      featured: featured || false
    };
    console.log('Listing data to insert:', JSON.stringify(listingData, null, 2));

    // Insert main listing
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('listings')
      .insert(listingData)
      .select()
      .single();

    if (listingError) {
      console.error('Error creating listing:', listingError);
      return res.status(500).json({ error: `Failed to create listing: ${listingError.message}` });
    }
    console.log('Listing inserted successfully:', listing.id);

    // Insert images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((img: any, index: number) => ({
        listing_id: listing.id,
        image_url: img.url,
        caption: img.caption,
        display_order: img.display_order || index,
        is_main: img.is_main || false
      }));

      await supabaseAdmin.from('listing_images').insert(imageInserts);
    }

    // Insert Kuula spheres if provided
    if (kuula_spheres && kuula_spheres.length > 0) {
      const kuulaInserts = kuula_spheres.map((sphere: any, index: number) => ({
        listing_id: listing.id,
        kuula_id: sphere.kuula_id,
        title: sphere.title,
        description: sphere.description,
        display_order: sphere.display_order || index
      }));

      await supabaseAdmin.from('listing_kuula_spheres').insert(kuulaInserts);
    }

    // Insert features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: any) => ({
        listing_id: listing.id,
        feature: feature.feature,
        category: feature.category
      }));

      await supabaseAdmin.from('listing_features').insert(featureInserts);
    }

    res.status(201).json({
      ...listing,
      listing_url: listingUrl,
      qr_code_url: qrCodeDataUrl
    });
  } catch (error) {
    console.error('Error in POST /listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update listing (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      lot_size,
      year_built,
      property_type,
      main_image_url,
      zillow_tour_url,
      floor_plan_url,
      status,
      featured,
      images,
      kuula_spheres,
      features,
      regenerate_qr
    } = req.body;

    // Get current listing
    const { data: currentListing, error: fetchError } = await supabaseAdmin
      .from('listings')
      .select('slug, title')
      .eq('id', id)
      .single();

    if (fetchError || !currentListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    let updateData: any = {
      description,
      location,
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      lot_size,
      year_built,
      property_type,
      main_image_url,
      zillow_tour_url,
      floor_plan_url,
      status,
      featured
    };

    // If title changed, generate new slug
    if (title && title !== currentListing.title) {
      updateData.title = title;
      updateData.slug = await generateUniqueSlug(title);

      // Generate new QR code with new slug
      const baseUrl = process.env.FRONTEND_URL || 'https://kevinlandenrealestate.com';
      const listingUrl = `${baseUrl}/listing/${updateData.slug}`;
      updateData.qr_code_url = await generateQRCode(listingUrl);
    } else if (regenerate_qr) {
      // Regenerate QR code with existing slug
      const baseUrl = process.env.FRONTEND_URL || 'https://kevinlandenrealestate.com';
      const listingUrl = `${baseUrl}/listing/${currentListing.slug}`;
      updateData.qr_code_url = await generateQRCode(listingUrl);
    }

    // Update main listing
    const { data: listing, error: updateError } = await supabaseAdmin
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating listing:', updateError);
      return res.status(500).json({ error: 'Failed to update listing' });
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await supabaseAdmin
        .from('listing_images')
        .delete()
        .eq('listing_id', id);

      // Insert new images
      if (images.length > 0) {
        const imageInserts = images.map((img: any, index: number) => ({
          listing_id: id,
          image_url: img.url,
          caption: img.caption,
          display_order: img.display_order || index,
          is_main: img.is_main || false
        }));

        await supabaseAdmin.from('listing_images').insert(imageInserts);
      }
    }

    // Update Kuula spheres if provided
    if (kuula_spheres !== undefined) {
      // Delete existing spheres
      await supabaseAdmin
        .from('listing_kuula_spheres')
        .delete()
        .eq('listing_id', id);

      // Insert new spheres
      if (kuula_spheres.length > 0) {
        const kuulaInserts = kuula_spheres.map((sphere: any, index: number) => ({
          listing_id: id,
          kuula_id: sphere.kuula_id,
          title: sphere.title,
          description: sphere.description,
          display_order: sphere.display_order || index
        }));

        await supabaseAdmin.from('listing_kuula_spheres').insert(kuulaInserts);
      }
    }

    // Update features if provided
    if (features !== undefined) {
      // Delete existing features
      await supabaseAdmin
        .from('listing_features')
        .delete()
        .eq('listing_id', id);

      // Insert new features
      if (features.length > 0) {
        const featureInserts = features.map((feature: any) => ({
          listing_id: id,
          feature: feature.feature,
          category: feature.category
        }));

        await supabaseAdmin.from('listing_features').insert(featureInserts);
      }
    }

    res.json(listing);
  } catch (error) {
    console.error('Error in PUT /listings/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE listing (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      return res.status(500).json({ error: 'Failed to delete listing' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /listings/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET QR code for a listing (admin only)
router.get('/:id/qr-code', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .select('slug, qr_code_url')
      .eq('id', id)
      .single();

    if (error || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // If QR code doesn't exist, generate it
    if (!listing.qr_code_url) {
      const baseUrl = process.env.FRONTEND_URL || 'https://kevinlandenrealestate.com';
      const listingUrl = `${baseUrl}/listing/${listing.slug}`;
      const qrCodeDataUrl = await generateQRCode(listingUrl);

      // Update listing with QR code
      await supabaseAdmin
        .from('listings')
        .update({ qr_code_url: qrCodeDataUrl })
        .eq('id', id);

      res.json({ qr_code_url: qrCodeDataUrl, listing_url: listingUrl });
    } else {
      const baseUrl = process.env.FRONTEND_URL || 'https://kevinlandenrealestate.com';
      res.json({
        qr_code_url: listing.qr_code_url,
        listing_url: `${baseUrl}/listing/${listing.slug}`
      });
    }
  } catch (error) {
    console.error('Error in GET /listings/:id/qr-code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;