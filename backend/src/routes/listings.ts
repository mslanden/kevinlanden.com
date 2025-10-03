import express from 'express';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';
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
router.get('/', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
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
          image_url,
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
          image_url,
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
router.post('/', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
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
      drone_video_url,
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
    const baseUrl = process.env.FRONTEND_URL || 'https://outriderrealty.com';
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
      drone_video_url: drone_video_url || null,
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

    // Insert Google Drive spheres if provided
    if (kuula_spheres && kuula_spheres.length > 0) {
      const kuulaInserts = kuula_spheres.map((sphere: any, index: number) => ({
        listing_id: listing.id,
        image_url: sphere.image_url,
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
router.put('/:id', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
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
      drone_video_url,
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
      drone_video_url,
      status,
      featured
    };

    // If title changed, generate new slug
    if (title && title !== currentListing.title) {
      updateData.title = title;
      updateData.slug = await generateUniqueSlug(title);

      // Generate new QR code with new slug
      const baseUrl = process.env.FRONTEND_URL || 'https://outriderrealty.com';
      const listingUrl = `${baseUrl}/listing/${updateData.slug}`;
      updateData.qr_code_url = await generateQRCode(listingUrl);
    } else if (regenerate_qr) {
      // Regenerate QR code with existing slug
      const baseUrl = process.env.FRONTEND_URL || 'https://outriderrealty.com';
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

    // Update images if provided (only update if images array is explicitly provided and not empty)
    if (images !== undefined && Array.isArray(images) && images.length > 0) {
      console.log('Updating images for listing:', id, 'with', images.length, 'images');

      // Delete existing images
      await supabaseAdmin
        .from('listing_images')
        .delete()
        .eq('listing_id', id);

      // Insert new images
      const imageInserts = images.map((img: any, index: number) => ({
        listing_id: id,
        image_url: img.url,
        caption: img.caption,
        display_order: img.display_order || index,
        is_main: img.is_main || false
      }));

      await supabaseAdmin.from('listing_images').insert(imageInserts);
      console.log('Successfully updated', imageInserts.length, 'images');
    } else if (images !== undefined && Array.isArray(images) && images.length === 0) {
      console.log('Empty images array provided - this would delete all images. Skipping update to preserve existing images.');
      // Skip update to preserve existing images when empty array is sent
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
          image_url: sphere.image_url,
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
router.delete('/:id', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // First, get all associated images to clean up from storage
    const { data: images, error: imagesFetchError } = await supabaseAdmin
      .from('listing_images')
      .select('image_url')
      .eq('listing_id', id);

    if (imagesFetchError) {
      console.error('Error fetching listing images for cleanup:', imagesFetchError);
      // Continue with deletion even if image fetch fails
    }

    // Extract storage paths from image URLs for cleanup
    const imagePaths: string[] = [];
    if (images && images.length > 0) {
      images.forEach(img => {
        if (img.image_url && img.image_url.includes('/storage/v1/object/public/listing-images/')) {
          // Extract path after the public bucket URL
          const path = img.image_url.split('/storage/v1/object/public/listing-images/')[1];
          if (path) {
            imagePaths.push(path);
          }
        }
      });
    }

    // Delete images from Supabase Storage
    if (imagePaths.length > 0) {
      console.log(`Deleting ${imagePaths.length} images from storage for listing ${id}`);
      const { error: storageDeleteError } = await supabaseAdmin.storage
        .from('listing-images')
        .remove(imagePaths);

      if (storageDeleteError) {
        console.error('Error deleting images from storage:', storageDeleteError);
        // Continue with listing deletion even if storage cleanup fails
      } else {
        console.log('Successfully deleted images from storage');
      }
    }

    // Delete the listing (this will cascade delete related records due to foreign key constraints)
    const { error } = await supabaseAdmin
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      return res.status(500).json({ error: 'Failed to delete listing' });
    }

    res.json({
      message: 'Listing deleted successfully',
      deletedImages: imagePaths.length
    });
  } catch (error) {
    console.error('Error in DELETE /listings/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE single image from listing (admin only)
router.delete('/:id/image/:imageId', adminLimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, imageId } = req.params;

    // First, get the image to find its storage path
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('listing_images')
      .select('image_url')
      .eq('id', imageId)
      .eq('listing_id', id)
      .single();

    if (fetchError || !image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Extract storage path from URL
    let storagePath: string | null = null;
    if (image.image_url && image.image_url.includes('/storage/v1/object/public/listing-images/')) {
      storagePath = image.image_url.split('/storage/v1/object/public/listing-images/')[1];
    }

    // Delete from storage if path exists
    if (storagePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('listing-images')
        .remove([storagePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with database deletion even if storage fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('listing_images')
      .delete()
      .eq('id', imageId)
      .eq('listing_id', id);

    if (deleteError) {
      console.error('Error deleting image from database:', deleteError);
      return res.status(500).json({ error: 'Failed to delete image from database' });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /listings/:id/image/:imageId:', error);
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
      const baseUrl = process.env.FRONTEND_URL || 'https://outriderrealty.com';
      const listingUrl = `${baseUrl}/listing/${listing.slug}`;
      const qrCodeDataUrl = await generateQRCode(listingUrl);

      // Update listing with QR code
      await supabaseAdmin
        .from('listings')
        .update({ qr_code_url: qrCodeDataUrl })
        .eq('id', id);

      res.json({ qr_code_url: qrCodeDataUrl, listing_url: listingUrl });
    } else {
      const baseUrl = process.env.FRONTEND_URL || 'https://outriderrealty.com';
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