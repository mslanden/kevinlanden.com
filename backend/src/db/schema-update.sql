-- Add Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  communities TEXT[] NOT NULL, -- Array to store selected communities (anza, aguanga, idyllwild, mountain-center)
  source TEXT DEFAULT 'website', -- Where they signed up from (buyers-guide, sellers-guide, etc)
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email) -- Ensure email uniqueness
);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert newsletter subscribers
CREATE POLICY "Public can create newsletter subscribers" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to read newsletter subscribers (for admin)
CREATE POLICY "Authenticated users can read newsletter subscribers" 
ON newsletter_subscribers FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Create index on communities for filtering
CREATE INDEX idx_newsletter_subscribers_communities ON newsletter_subscribers USING GIN(communities);

-- Create index on created_at for sorting
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at DESC);