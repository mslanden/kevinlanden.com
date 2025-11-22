-- Create tables for Kevin Landen Real Estate Website

-- Listings Table (replaces legacy Properties table)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'CA',
  zip_code TEXT,
  price NUMERIC,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet NUMERIC,
  lot_size NUMERIC,
  year_built INTEGER,
  property_type TEXT,
  main_image_url TEXT,
  zillow_tour_url TEXT,
  floor_plan_url TEXT,
  drone_video_url TEXT,
  listing_book_pdf_url TEXT,
  qr_code_url TEXT,
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

-- Listing 360° Photo Spheres (Google Drive / Kuula)
CREATE TABLE listing_kuula_spheres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing Features Table
CREATE TABLE listing_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy Properties Table (kept for backwards compatibility - migrate to listings)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ranch', 'farm', 'country-home', 'land', 'luxury', 'mountain')),
  price NUMERIC NOT NULL CHECK (price >= 0),
  bedrooms INTEGER CHECK (bedrooms >= 0),
  bathrooms NUMERIC CHECK (bathrooms >= 0),
  square_feet NUMERIC CHECK (square_feet >= 0),
  acreage NUMERIC CHECK (acreage >= 0),
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL CHECK (length(state) = 2),
  zip_code TEXT CHECK (zip_code ~ '^\\d{5}(-\\d{4})?$'),
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold')),
  main_image_url TEXT,
  price_per_sqft NUMERIC,
  days_on_market INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy Property Images Table
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy Property Features Table
CREATE TABLE property_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Categories Table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create update_updated_at function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at field updates
CREATE TRIGGER properties_updated_at_trigger
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at_trigger
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create trigger for listings table
CREATE TRIGGER listings_updated_at_trigger
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_kuula_spheres ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for listings (public can read active listings)
CREATE POLICY "Public can read active listings"
ON listings FOR SELECT
USING (status = 'active');

CREATE POLICY "Public can read listing images"
ON listing_images FOR SELECT
USING (true);

CREATE POLICY "Public can read listing spheres"
ON listing_kuula_spheres FOR SELECT
USING (true);

CREATE POLICY "Public can read listing features"
ON listing_features FOR SELECT
USING (true);

-- Legacy properties policies
CREATE POLICY "Public can read properties"
ON properties FOR SELECT
USING (true);

CREATE POLICY "Public can read property images"
ON property_images FOR SELECT
USING (true);

CREATE POLICY "Public can read property features"
ON property_features FOR SELECT
USING (true);

CREATE POLICY "Public can read blog posts" 
ON blog_posts FOR SELECT 
USING (published = true);

CREATE POLICY "Public can read blog categories" 
ON blog_categories FOR SELECT 
USING (true);

CREATE POLICY "Public can create contact submissions" 
ON contact_submissions FOR INSERT 
WITH CHECK (true);

-- Blowout Sale Tracking Table
CREATE TABLE blowout_sale (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_spots INTEGER NOT NULL DEFAULT 25,
  spots_remaining INTEGER NOT NULL DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for blowout_sale
ALTER TABLE blowout_sale ENABLE ROW LEVEL SECURITY;

-- Create policies for blowout_sale
CREATE POLICY "Public can read blowout sale" 
ON blowout_sale FOR SELECT 
USING (true);

-- Create trigger for blowout_sale updated_at
CREATE TRIGGER blowout_sale_updated_at_trigger
BEFORE UPDATE ON blowout_sale
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Insert initial blowout sale data
INSERT INTO blowout_sale (total_spots, spots_remaining) VALUES (25, 25);

-- Price Per Square Foot Tracking Table
CREATE TABLE price_per_sqft_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL, -- 'anza', 'aguanga', 'idyllwild', 'mountain_center'
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2050),
  price_per_sqft NUMERIC(8,2) NOT NULL,
  average_price NUMERIC(12,2),
  total_sales INTEGER DEFAULT 0,
  median_days_on_market INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location, month, year)
);

-- Days On Market Tracking Table
CREATE TABLE days_on_market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL, -- 'anza', 'aguanga', 'idyllwild', 'mountain_center'
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2050),
  average_days_on_market NUMERIC(5,1) NOT NULL,
  median_days_on_market INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location, month, year)
);

-- Enable RLS for new tables
ALTER TABLE price_per_sqft_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE days_on_market_data ENABLE ROW LEVEL SECURITY;

-- Create policies for price_per_sqft_data
CREATE POLICY "Public can read price per sqft data" 
ON price_per_sqft_data FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage price per sqft data" 
ON price_per_sqft_data FOR ALL 
USING (auth.role() = 'authenticated');

-- Create policies for days_on_market_data
CREATE POLICY "Public can read days on market data" 
ON days_on_market_data FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage days on market data" 
ON days_on_market_data FOR ALL 
USING (auth.role() = 'authenticated');

-- Create triggers for updated_at fields
CREATE TRIGGER price_per_sqft_data_updated_at_trigger
BEFORE UPDATE ON price_per_sqft_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER days_on_market_data_updated_at_trigger
BEFORE UPDATE ON days_on_market_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Add price_per_sqft field to properties table
ALTER TABLE properties ADD COLUMN price_per_sqft NUMERIC(8,2);

-- Add days_on_market field to properties table
ALTER TABLE properties ADD COLUMN days_on_market INTEGER;

-- Initial data for blog categories
INSERT INTO blog_categories (name, slug) VALUES
('Buying Tips', 'buying-tips'),
('Selling Tips', 'selling-tips'),
('Livestock', 'livestock'),
('Property Management', 'property-management'),
('Country Living', 'country-living'),
('Market Trends', 'market-trends');

-- Best In Show Content Table
CREATE TABLE best_in_show_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL CHECK (section IN ('photography', 'virtual-staging', 'item-removal', '3d-tours')),
  item_type TEXT NOT NULL CHECK (item_type IN ('gallery-item', 'before-after', '360-viewer', 'iframe-embed')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_url_before TEXT,
  embed_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for best_in_show_items
ALTER TABLE best_in_show_items ENABLE ROW LEVEL SECURITY;

-- Create policies for best_in_show_items
CREATE POLICY "Public can read active best in show items"
ON best_in_show_items FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can manage best in show items"
ON best_in_show_items FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger for best_in_show_items updated_at
CREATE TRIGGER best_in_show_items_updated_at_trigger
BEFORE UPDATE ON best_in_show_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();