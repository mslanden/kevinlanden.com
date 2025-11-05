import express from 'express';
import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import multer from 'multer';
import Papa from 'papaparse';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'text/csv', 'application/csv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, image files (JPEG, PNG, WebP), and CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Types for MLS data
interface MLSData {
  listings: Array<{
    mls: string;
    status: string;
    price: number;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    yearBuilt: number;
    pricePerSqft?: number;
    daysOnMarket?: number;
  }>;
  summary: {
    unitSales: string;
    medianPrice: string;
    inventory: string;
    daysOnMarket: string;
    quickAnalysis: string;
  };
  statusSummary: {
    active: number;
    pending: number;
    closed: number;
    other: number;
  };
  priceRanges: Array<{
    label: string;
    count: number;
  }>;
}

// Valid locations for data validation
const validLocations = ['anza', 'aguanga', 'idyllwild', 'mountain_center'];

// Validate location parameter
const validateLocation = (location: string): boolean => {
  return validLocations.includes(location.toLowerCase());
};

// Validate month and year parameters
const validateDate = (month: number, year: number): boolean => {
  return month >= 1 && month <= 12 && year >= 2020 && year <= 2050;
};

// Normalize location name to prevent hyphen/underscore mismatches
// Accepts both formats but always returns underscore format
const normalizeLocation = (location: string): string => {
  const normalized = location.toLowerCase().replace(/-/g, '_');

  // Warn if hyphen format was used (for debugging)
  if (location.includes('-')) {
    console.warn(`Location "${location}" uses hyphens - normalized to "${normalized}". Please update frontend to use underscores.`);
  }

  return normalized;
};

// Get user-friendly location error message
const getLocationErrorMessage = (): string => {
  return `Invalid location. Must be one of: ${validLocations.join(', ')}`;
};

// GET /api/market-data/price-per-sqft/:location
// Get price per sqft data for a specific location (last 6 months)
router.get('/price-per-sqft/:location', async (req: Request, res: Response) => {
  try {
    const location = normalizeLocation(req.params.location);
    const { limit = '6' } = req.query;

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    const { data, error } = await supabase
      .from('price_per_sqft_data')
      .select('*')
      .eq('location', location)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(parseInt(limit as string));

    if (error) {
      console.error('Error fetching price per sqft data:', error);
      return res.status(500).json({ error: 'Failed to fetch price per sqft data' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in price per sqft endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/market-data/days-on-market/:location
// Get days on market data for a specific location (last 6 months)
router.get('/days-on-market/:location', async (req: Request, res: Response) => {
  try {
    const location = normalizeLocation(req.params.location);
    const { limit = '6' } = req.query;

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    const { data, error } = await supabase
      .from('days_on_market_data')
      .select('*')
      .eq('location', location)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(parseInt(limit as string));

    if (error) {
      console.error('Error fetching days on market data:', error);
      return res.status(500).json({ error: 'Failed to fetch days on market data' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in days on market endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/market-data/price-per-sqft
// Add or update price per sqft data for a location/month/year
router.post('/price-per-sqft', async (req: Request, res: Response) => {
  try {
    const {
      month,
      year,
      price_per_sqft,
      average_price,
      total_sales,
      median_days_on_market
    } = req.body;

    const location = normalizeLocation(req.body.location);

    // Validate required fields
    if (!req.body.location || !month || !year || !price_per_sqft) {
      return res.status(400).json({
        error: 'Missing required fields: location, month, year, price_per_sqft'
      });
    }

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    if (!validateDate(month, year)) {
      return res.status(400).json({
        error: 'Invalid date. Month must be 1-12, year must be 2020-2050'
      });
    }

    // Use upsert to handle updates or inserts
    const { data, error } = await supabase
      .from('price_per_sqft_data')
      .upsert({
        location: location,
        month,
        year,
        price_per_sqft: parseFloat(price_per_sqft),
        average_price: average_price ? parseFloat(average_price) : null,
        total_sales: total_sales ? parseInt(total_sales) : 0,
        median_days_on_market: median_days_on_market ? parseInt(median_days_on_market) : null
      }, {
        onConflict: 'location,month,year'
      })
      .select();

    if (error) {
      console.error('Error upserting price per sqft data:', error);
      return res.status(500).json({ error: 'Failed to save price per sqft data' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in price per sqft upsert endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/market-data/days-on-market
// Add or update days on market data for a location/month/year
router.post('/days-on-market', async (req: Request, res: Response) => {
  try {
    const {
      month,
      year,
      average_days_on_market,
      median_days_on_market
    } = req.body;

    const location = normalizeLocation(req.body.location);

    // Validate required fields
    if (!req.body.location || !month || !year || !average_days_on_market) {
      return res.status(400).json({
        error: 'Missing required fields: location, month, year, average_days_on_market'
      });
    }

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    if (!validateDate(month, year)) {
      return res.status(400).json({
        error: 'Invalid date. Month must be 1-12, year must be 2020-2050'
      });
    }

    // Use upsert to handle updates or inserts
    const { data, error } = await supabase
      .from('days_on_market_data')
      .upsert({
        location: location,
        month,
        year,
        average_days_on_market: parseFloat(average_days_on_market),
        median_days_on_market: median_days_on_market ? parseInt(median_days_on_market) : null
      }, {
        onConflict: 'location,month,year'
      })
      .select();

    if (error) {
      console.error('Error upserting days on market data:', error);
      return res.status(500).json({ error: 'Failed to save days on market data' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in days on market upsert endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/market-data/all/:location
// Get all market data for a location (price per sqft + days on market)
router.get('/all/:location', async (req: Request, res: Response) => {
  try {
    const location = normalizeLocation(req.params.location);
    const { limit = '6' } = req.query;

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    // Fetch both price per sqft and days on market data
    const [pricePerSqftResult, daysOnMarketResult] = await Promise.all([
      supabase
        .from('price_per_sqft_data')
        .select('*')
        .eq('location', location)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(parseInt(limit as string)),
      
      supabase
        .from('days_on_market_data')
        .select('*')
        .eq('location', location)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(parseInt(limit as string))
    ]);

    if (pricePerSqftResult.error) {
      console.error('Error fetching price per sqft data:', pricePerSqftResult.error);
      return res.status(500).json({ error: 'Failed to fetch price per sqft data' });
    }

    if (daysOnMarketResult.error) {
      console.error('Error fetching days on market data:', daysOnMarketResult.error);
      return res.status(500).json({ error: 'Failed to fetch days on market data' });
    }

    res.json({
      location,
      pricePerSqft: pricePerSqftResult.data,
      daysOnMarket: daysOnMarketResult.data
    });
  } catch (error) {
    console.error('Error in all market data endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get market data for newsletter (6 months back from selected month/year for specific community)
router.get('/newsletter-data', 
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get parameters from query
      const rawCommunity = req.query.community as string;
      const selectedMonth = parseInt(req.query.month as string);
      const selectedYear = parseInt(req.query.year as string);

      if (!rawCommunity) {
        return res.status(400).json({
          success: false,
          message: 'Community parameter is required'
        });
      }

      // Normalize and validate community
      const community = normalizeLocation(rawCommunity);
      if (!validateLocation(community)) {
        return res.status(400).json({
          success: false,
          message: getLocationErrorMessage()
        });
      }

      // Use selected month/year or default to current date
      const targetDate = new Date();
      if (selectedMonth && selectedYear) {
        targetDate.setFullYear(selectedYear, selectedMonth - 1, 1);
      }
      
      // Calculate date range for 6 months ending with selected month
      const sixMonthsAgo = new Date(targetDate);
      sixMonthsAgo.setMonth(targetDate.getMonth() - 5); // Go back 5 months (6 total including target month)
      
      console.log(`Newsletter API called with: community=${community}, month=${selectedMonth}, year=${selectedYear}`);
      console.log(`Target date: ${targetDate.toISOString()}`);
      console.log(`Six months ago: ${sixMonthsAgo.toISOString()}`);
      
      // Get price per sqft data for last 6 months for specific community
      const { data: priceData, error: priceError } = await supabase
        .from('price_per_sqft_data')
        .select('*')
        .eq('location', community)
        .gte('year', sixMonthsAgo.getFullYear())
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (priceError) {
        throw new Error(`Failed to fetch price data: ${priceError.message}`);
      }

      // Get days on market data for last 6 months for specific community
      const { data: daysData, error: daysError } = await supabase
        .from('days_on_market_data')
        .select('*')
        .eq('location', community)
        .gte('year', sixMonthsAgo.getFullYear())
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (daysError) {
        throw new Error(`Failed to fetch days on market data: ${daysError.message}`);
      }

      // Get MLS listings for the specific community, month, and year
      const { data: mlsListings, error: mlsError } = await supabase
        .from('mls_listings')
        .select('*')
        .eq('location', community)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .order('price', { ascending: false }); // Order by price descending

      if (mlsError) {
        console.warn(`Warning: Failed to fetch MLS listings: ${mlsError.message}`);
        // Don't throw error for MLS listings - it's not critical if this fails
      }

      // Filter to show last 6 months of available data ending with selected month
      const filterDateRange = (data: any[]) => {
        // First filter to only data up to and including the selected month
        const dataUpToTarget = data.filter(item => {
          const itemDate = new Date(item.year, item.month - 1);
          return itemDate <= targetDate;
        }).sort((a, b) => {
          // Sort chronologically (oldest first)
          if (a.year !== b.year) return a.year - b.year;
          return a.month - b.month;
        });
        
        // Take the last 6 months from available data
        const result = dataUpToTarget.slice(-6);
        
        console.log(`Date range requested: ${sixMonthsAgo.toISOString()} to ${targetDate.toISOString()}`);
        console.log(`All ${community} data up to target:`, dataUpToTarget.map(item => `${item.month}/${item.year}`));
        console.log(`Final ${community} data (last 6):`, result.map(item => `${item.month}/${item.year}`));
        
        return result;
      };

      const filteredPriceData = filterDateRange(priceData || []);
      const filteredDaysData = filterDateRange(daysData || []);

      console.log(`Found ${mlsListings?.length || 0} MLS listings for ${community} ${selectedMonth}/${selectedYear}`);

      res.json({
        success: true,
        data: {
          pricePerSqft: filteredPriceData,
          daysOnMarket: filteredDaysData,
          mlsListings: mlsListings || [],
          community: community
        }
      });

    } catch (error) {
      console.error('Error fetching newsletter market data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch market data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

// Upload CSV file with MLS listings and save to database (admin only)
router.post('/upload-csv',
  authenticateToken,
  requireAdmin,
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const { month, year } = req.body;
    const location = normalizeLocation(req.body.location);

    if (!file) {
      return res.status(400).json({ error: 'No CSV file provided' });
    }

    if (!req.body.location || !month || !year) {
      return res.status(400).json({ error: 'Location, month, and year are required' });
    }

    if (!validateLocation(location)) {
      return res.status(400).json({
        error: getLocationErrorMessage()
      });
    }

    if (!validateDate(parseInt(month), parseInt(year))) {
      return res.status(400).json({
        error: 'Invalid date. Month must be 1-12, year must be 2020-2050'
      });
    }

    try {
      // Parse CSV file
      const csvText = file.buffer.toString('utf-8');
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parseResult.errors.length > 0) {
        console.error('CSV parsing errors:', parseResult.errors);
        return res.status(400).json({
          error: 'Failed to parse CSV file',
          details: parseResult.errors[0].message
        });
      }

      const rows = parseResult.data as any[];
      console.log(`Parsed ${rows.length} rows from CSV`);

      // Transform CSV rows to MLS listing format
      const listings = rows.map((row: any) => {
        // Build address from components
        const addressParts = [
          row['Street #'],
          row['Street Direction'],
          row['Street Name'],
          row['Post Direction'],
          row['Street Suffix']
        ].filter(Boolean);
        const address = addressParts.join(' ').trim();

        // Map status codes (A=Active, P=Pending, etc)
        let status = 'active';
        if (row['Status']) {
          const statusCode = row['Status'].toUpperCase();
          if (statusCode === 'A') status = 'active';
          else if (statusCode === 'P') status = 'pending';
          else if (statusCode === 'C') status = 'closed';
          else if (statusCode === 'S') status = 'sold';
          else if (statusCode === 'X') status = 'expired';
          else if (statusCode === 'W') status = 'withdrawn';
        }

        // Parse numeric values
        const parseNumber = (val: any) => {
          if (!val) return null;
          const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
          return isNaN(num) ? null : num;
        };

        const parseIntValue = (val: any) => {
          if (!val) return null;
          const num = parseNumber(val);
          return num ? Math.round(num) : null;
        };

        return {
          mls: row['List Number'] || '',
          status: status,
          price: parseNumber(row['List Price'] || row['Closed Price']) || 0,
          address: address || `${row['City']}, ${row['State']}`,
          beds: parseIntValue(row['Total Bedrooms']) || 0,
          baths: parseNumber(row['Total Baths']) || 0,
          sqft: parseIntValue(row['Approx SqFt']) || 0,
          yearBuilt: parseIntValue(row['Year Built']) || 0,
          daysOnMarket: parseIntValue(row['Days on Market']) || 0,
          pricePerSqft: parseNumber(row['List Price/SqFt']) || 0
        };
      }).filter(listing => listing.mls && listing.address); // Only keep valid listings

      console.log(`Transformed ${listings.length} valid listings from CSV`);

      if (listings.length === 0) {
        return res.status(400).json({
          error: 'No valid listings found in CSV file'
        });
      }

      // Save to database
      const savedListings = await saveMlsListingsToDatabase(
        listings,
        location,
        parseInt(month),
        parseInt(year)
      );

      // Calculate and save aggregate statistics
      const aggregateData = {
        listings: listings,
        summary: {
          unitSales: '',
          medianPrice: '',
          inventory: listings.length.toString(),
          daysOnMarket: '',
          quickAnalysis: ''
        },
        statusSummary: {
          active: listings.filter(l => l.status === 'active').length,
          pending: listings.filter(l => l.status === 'pending').length,
          closed: listings.filter(l => l.status === 'closed' || l.status === 'sold').length,
          other: listings.filter(l => !['active', 'pending', 'closed', 'sold'].includes(l.status)).length
        },
        priceRanges: []
      };

      await updateAggregateStatistics(aggregateData, location, parseInt(month), parseInt(year));

      res.json({
        success: true,
        message: `Successfully imported ${savedListings.length} listings from CSV`,
        imported: savedListings.length,
        total: rows.length,
        skipped: rows.length - listings.length
      });

    } catch (error) {
      console.error('Error processing CSV file:', error);
      res.status(500).json({
        error: 'Failed to process CSV file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

// Helper function to save MLS listings to database
async function saveMlsListingsToDatabase(listings: any[], location: string, month: number, year: number, userId?: string): Promise<any[]> {
  console.log(`Saving ${listings.length} MLS listings to database for ${location} ${month}/${year}`);
  
  const savedListings = [];
  
  for (const listing of listings) {
    try {
      // Clean and validate MLS number (handle letters, dashes, etc.)
      const cleanMlsNumber = (listing.mls || '').toString().trim();
      if (!cleanMlsNumber || cleanMlsNumber.length < 3) {
        console.warn(`Skipping listing with invalid MLS number: "${listing.mls}"`);
        continue;
      }

      // Parse price to get numeric value (handle various formats)
      let price = 0;
      if (listing.price) {
        const priceStr = listing.price.toString().replace(/[^\d]/g, '');
        price = parseInt(priceStr) || 0;
        if (price < 1000 || price > 100000000) {
          console.warn(`Skipping listing ${cleanMlsNumber} with invalid price: "${listing.price}" -> ${price}`);
          continue;
        }
      }
      
      // Validate and clean other numeric fields
      const beds = Math.max(0, parseInt(listing.beds) || 0);
      const baths = Math.max(0, parseFloat(listing.baths) || 0);
      const sqft = Math.max(0, parseInt(listing.sqft) || 0);
      const yearBuilt = listing.yearBuilt && listing.yearBuilt > 1800 && listing.yearBuilt <= new Date().getFullYear() 
        ? parseInt(listing.yearBuilt) 
        : null;
      const daysInMarket = listing.daysOnMarket && listing.daysOnMarket >= 0 
        ? parseInt(listing.daysOnMarket) 
        : null;

      // Calculate price per sqft if both values exist
      let pricePerSqft = null;
      if (price > 0 && sqft > 0) {
        pricePerSqft = Math.round(price / sqft);
      }

      // Clean and validate address
      const cleanAddress = (listing.address || '').toString().trim();
      if (!cleanAddress || cleanAddress.length < 5) {
        console.warn(`Skipping listing ${cleanMlsNumber} with invalid address: "${listing.address}"`);
        continue;
      }
      
      // Clean and validate status
      const cleanStatus = (listing.status || 'active').toString().toLowerCase().trim();
      const validStatuses = ['active', 'pending', 'closed', 'sold', 'expired', 'withdrawn'];
      const finalStatus = validStatuses.includes(cleanStatus) ? cleanStatus : 'active'; // Default to 'active' instead of 'unknown'
      
      // Prepare listing data for database - matching actual schema
      const listingData = {
        address: cleanAddress.substring(0, 255), // Limit address length
        location: normalizeLocation(location),
        month,
        year,
        mls_number: cleanMlsNumber.substring(0, 50), // Limit MLS number length
        status: finalStatus,
        price: price, // Note: column is named 'price' not 'list_price'
        beds: beds,
        baths: baths,
        sqft: sqft, // Note: column is named 'sqft' not 'square_feet'
        year_built: yearBuilt,
        price_per_sqft: pricePerSqft,
        days_in_market: daysInMarket
      };

      // Use upsert to handle duplicates by address
      console.log(`Attempting to save listing ${cleanMlsNumber} at ${cleanAddress}`);
      
      const { data, error } = await supabase
        .from('mls_listings')
        .upsert(listingData, {
          onConflict: 'address,month,year,location'
        })
        .select();

      if (error) {
        console.error(`❌ Database error saving listing ${cleanMlsNumber}:`, {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          listingData: {
            mls: cleanMlsNumber,
            address: cleanAddress,
            price: price,
            status: finalStatus
          }
        });
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✅ Successfully saved listing ${cleanMlsNumber}`);
        savedListings.push(data[0]);
      } else {
        console.warn(`⚠️  No data returned for listing ${cleanMlsNumber} (may have been duplicate)`);
      }
    } catch (error) {
      console.error(`💥 Exception processing listing ${listing.mls || 'unknown'}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        listing: listing
      });
    }
  }
  
  console.log(`Successfully saved ${savedListings.length} listings to database`);
  return savedListings;
}


// Helper function to update aggregate statistics
async function updateAggregateStatistics(extractedData: MLSData, location: string, month: number, year: number): Promise<void> {
  console.log(`Updating aggregate statistics for ${location} ${month}/${year}`);
  
  try {
    // Calculate aggregate data from listings
    const { priceData, daysData } = calculateAggregateData(extractedData.listings);
    
    // Update price per sqft data
    if (priceData.averagePrice > 0 || priceData.medianPrice > 0) {
      const { error: priceError } = await supabase
        .from('price_per_sqft_data')
        .upsert({
          location: normalizeLocation(location),
          month,
          year,
          price_per_sqft: priceData.pricePerSqft,
          average_price: priceData.averagePrice,
          total_sales: extractedData.statusSummary.closed || priceData.totalSales,
          median_days_on_market: daysData.medianDays
        }, {
          onConflict: 'location,month,year'
        });

      if (priceError) {
        console.error('Error updating price per sqft data:', priceError);
      } else {
        console.log('Successfully updated price per sqft data');
      }
    }

    // Update days on market data
    if (daysData.averageDays > 0 || daysData.medianDays > 0) {
      const { error: daysError } = await supabase
        .from('days_on_market_data')
        .upsert({
          location: normalizeLocation(location),
          month,
          year,
          average_days_on_market: daysData.averageDays,
          median_days_on_market: daysData.medianDays
        }, {
          onConflict: 'location,month,year'
        });

      if (daysError) {
        console.error('Error updating days on market data:', daysError);
      } else {
        console.log('Successfully updated days on market data');
      }
    }
  } catch (error) {
    console.error('Error updating aggregate statistics:', error);
  }
}

// Helper function to calculate aggregate data from listings
function calculateAggregateData(listings: any[]): { priceData: any; daysData: any } {
  const validListings = listings.filter(l => l.sqft > 0 && l.price);
  
  if (validListings.length === 0) {
    return {
      priceData: { pricePerSqft: 0, averagePrice: 0, medianPrice: 0, totalSales: 0 },
      daysData: { averageDays: 0, medianDays: 0 }
    };
  }
  
  // Calculate price data
  const prices = validListings.map(l => {
    return typeof l.price === 'number' ? l.price : 0;
  }).filter(p => p > 0);

  const sqftValues = validListings.map(l => l.sqft).filter(s => s > 0);

  const pricePerSqftValues = validListings
    .map(l => {
      const price = typeof l.price === 'number' ? l.price : 0;
      return l.sqft > 0 && price > 0 ? Math.round(price / l.sqft) : 0;
    })
    .filter(p => p > 0);

  // Calculate days on market data
  const daysOnMarketValues = listings
    .map(l => l.daysOnMarket)
    .filter(d => d != null && d > 0);

  const priceData = {
    pricePerSqft: median(pricePerSqftValues),
    averagePrice: Math.round(average(prices)),
    medianPrice: median(prices),
    totalSales: prices.length
  };

  const daysData = {
    averageDays: Math.round(average(daysOnMarketValues)),
    medianDays: median(daysOnMarketValues)
  };

  return { priceData, daysData };
}

// Helper functions for statistics
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

export default router;
