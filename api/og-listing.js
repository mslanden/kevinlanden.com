export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug parameter is required' });
  }

  try {
    // Fetch listing data from your API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.outriderrealty.com/api';
    const response = await fetch(`${apiUrl}/listings/${slug}`);

    if (!response.ok) {
      throw new Error('Listing not found');
    }

    const listing = await response.json();

    // Get the main image URL
    const ogImage = listing.listing_images && listing.listing_images.length > 0
      ? listing.listing_images[0].url
      : 'https://www.outriderrealty.com/images/shared.jpeg';

    // Format price
    const formattedPrice = listing.price
      ? `$${listing.price.toLocaleString()}`
      : 'Contact for Price';

    // Build description
    const metaDescription = `${formattedPrice} - ${listing.bedrooms || 0} beds, ${listing.bathrooms || 0} baths, ${listing.square_feet || 'N/A'} sq ft. ${listing.address}, ${listing.city}, ${listing.state}. ${listing.description ? listing.description.substring(0, 150) + '...' : 'View this property listing at Outrider Real Estate.'}`;

    // Read the base HTML file
    const fs = require('fs');
    const path = require('path');
    const htmlPath = path.join(process.cwd(), 'frontend', 'build', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Replace the default OG tags with listing-specific ones
    html = html.replace(
      '<meta property="og:title" content="Outrider Real Estate" />',
      `<meta property="og:title" content="${listing.address} - ${formattedPrice}" />`
    );

    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${metaDescription}" />`
    );

    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${ogImage}" />`
    );

    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="https://www.outriderrealty.com/listing/${slug}" />`
    );

    // Update Twitter Card tags
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${listing.address} - ${formattedPrice}" />`
    );

    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${metaDescription}" />`
    );

    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${ogImage}" />`
    );

    // Update the regular meta description
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${metaDescription}" />`
    );

    // Update the title tag
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${listing.address} - Outrider Real Estate</title>`
    );

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching listing:', error);
    // Return the default HTML on error
    const fs = require('fs');
    const path = require('path');
    const htmlPath = path.join(process.cwd(), 'frontend', 'build', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  }
}