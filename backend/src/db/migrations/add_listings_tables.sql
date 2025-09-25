-- Create tables for property listings with QR code support

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main Listings Table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Location Information
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'CA',
  zip_code TEXT,

  -- Property Details
  price NUMERIC(12, 2),
  bedrooms INTEGER,
  bathrooms NUMERIC(3, 1),
  square_feet NUMERIC(10, 2),
  lot_size NUMERIC(10, 2), -- in acres
  year_built INTEGER,
  property_type TEXT, -- house, condo, land, etc.

  -- Media URLs
  main_image_url TEXT,
  zillow_tour_url TEXT,
  floor_plan_url TEXT,
  qr_code_url TEXT, -- Generated QR code image URL

  -- Status and Metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'sold')),
  views_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing Images Table
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kuula 360 Spheres Table
CREATE TABLE listing_kuula_spheres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  kuula_id TEXT NOT NULL, -- The Kuula share ID
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional Property Features Table
CREATE TABLE listing_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  category TEXT, -- interior, exterior, community, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX idx_listing_kuula_listing_id ON listing_kuula_spheres(listing_id);
CREATE INDEX idx_listing_features_listing_id ON listing_features(listing_id);

-- Create trigger for automatic updated_at field updates
CREATE TRIGGER listings_updated_at_trigger
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_kuula_spheres ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_features ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read active listings"
ON listings FOR SELECT
USING (status = 'active');

CREATE POLICY "Public can read listing images"
ON listing_images FOR SELECT
USING (EXISTS (
  SELECT 1 FROM listings
  WHERE listings.id = listing_images.listing_id
  AND listings.status = 'active'
));

CREATE POLICY "Public can read listing kuula spheres"
ON listing_kuula_spheres FOR SELECT
USING (EXISTS (
  SELECT 1 FROM listings
  WHERE listings.id = listing_kuula_spheres.listing_id
  AND listings.status = 'active'
));

CREATE POLICY "Public can read listing features"
ON listing_features FOR SELECT
USING (EXISTS (
  SELECT 1 FROM listings
  WHERE listings.id = listing_features.listing_id
  AND listings.status = 'active'
));

-- Authenticated users (admin) can manage all listings
CREATE POLICY "Authenticated users can manage listings"
ON listings FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage listing images"
ON listing_images FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage listing kuula spheres"
ON listing_kuula_spheres FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage listing features"
ON listing_features FOR ALL
USING (auth.role() = 'authenticated');