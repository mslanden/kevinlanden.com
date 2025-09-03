-- Create tables for Kevin Landen Real Estate Website

-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- ranch, farm, country-home, land, luxury, mountain
  price NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet NUMERIC,
  acreage NUMERIC,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available', -- available, pending, sold
  main_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Images Table
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Features Table
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

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust these based on your authentication setup)
-- For example, public can read properties but only authenticated users can write
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