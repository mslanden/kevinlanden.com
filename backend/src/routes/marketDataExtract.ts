import express, { Request, Response } from 'express';
import multer from 'multer';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { supabase } from '../utils/supabaseClient';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// Try to import pdf2pic, but handle gracefully if not available
let fromBuffer: any = null;
try {
  const pdf2picModule = require('pdf2pic');
  fromBuffer = pdf2picModule.fromBuffer;
} catch (error) {
  console.warn('pdf2pic not available - PDF conversion will be disabled');
}

const router = express.Router();

// Endpoint to check if PDF processing is available
router.get('/pdf-support', 
  authenticateToken, 
  requireAdmin, 
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      pdfSupported: fromBuffer !== null,
      message: fromBuffer ? 'PDF processing is available' : 'PDF processing is not available on this server'
    });
  })
);

// Configure multer for image uploads ONLY
const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed. Use the PDF conversion endpoint for PDFs.'));
    }
  },
});

// Configure multer for PDF uploads ONLY
const uploadPdfs = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed on this endpoint.'));
    }
  },
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to convert PDF to images (using the same approach as newsletter)
const convertPdfToImages = async (pdfBuffer: Buffer): Promise<Buffer[]> => {
  if (!fromBuffer) {
    throw new Error('PDF processing is not available on this server');
  }
  
  try {
    console.log('Converting PDF to images using pdf2pic...');
    
    // Convert PDF buffer to images using pdf2pic (optimized for wide market data sheets)
    const convert = fromBuffer(pdfBuffer, {
      density: 300,           // Higher resolution for better text recognition
      saveFilename: "page",   // Output filename
      savePath: require('os').tmpdir(),  // Use temp directory
      format: "png",          // Output format
      width: 2550,            // Much wider to capture full market data sheets
      height: 3300            // Taller to maintain aspect ratio
    });
    
    const imageBuffers: Buffer[] = [];
    let pageNum = 1;
    
    // Convert pages until we can't find any more
    while (pageNum <= 10) { // Limit to 10 pages to prevent infinite loops
      try {
        const result = await convert(pageNum);
        const imagePath = (result as any).path;
        
        if (imagePath && fs.existsSync(imagePath)) {
          const imageBuffer = fs.readFileSync(imagePath);
          imageBuffers.push(imageBuffer);
          // Clean up temporary image file
          fs.unlinkSync(imagePath);
          pageNum++;
        } else {
          break; // No more pages
        }
      } catch (error) {
        // No more pages or conversion error
        break;
      }
    }
    
    if (imageBuffers.length === 0) {
      throw new Error('No pages could be converted from PDF');
    }
    
    console.log(`Successfully converted ${imageBuffers.length} pages from PDF`);
    return imageBuffers;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error('Failed to convert PDF to images');
  }
};

// Convert PDF to images endpoint
router.post('/convert-pdf-to-images', 
  authenticateToken, 
  requireAdmin, 
  uploadPdfs.single('pdf'), 
  asyncHandler(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      });
    }

    if (!fromBuffer) {
      return res.status(400).json({
        success: false,
        message: 'PDF processing is not available on this server. Please convert to image format manually.',
        pdfSupported: false
      });
    }

    try {
      // Convert PDF to images
      const imageBuffers = await convertPdfToImages(file.buffer);
      
      // Convert images to base64 for easy transfer
      const images = imageBuffers.map((buffer, index) => ({
        id: `pdf-page-${index + 1}`,
        data: buffer.toString('base64'),
        mimeType: 'image/png',
        filename: `${file.originalname.replace('.pdf', '')}-page-${index + 1}.png`
      }));

      res.json({
        success: true,
        message: `PDF converted to ${images.length} image(s)`,
        images,
        originalFilename: file.originalname
      });

    } catch (error) {
      console.error('Error converting PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to convert PDF to images',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

// Extract market data from uploaded images
router.post('/extract-from-images', 
  authenticateToken, 
  requireAdmin, 
  uploadImages.array('images', 10), 
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const { reportMonth, reportYear, reportLocation } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    if (!reportMonth || !reportYear || !reportLocation) {
      return res.status(400).json({
        success: false,
        message: 'Report month, year, and location are required'
      });
    }

    try {
      const extractedData: any = {
        pricePerSqft: [],
        daysOnMarket: []
      };

      for (const file of files) {
        // Process image file
        const buffer = file.buffer;
        const mimeType = file.mimetype;
        
        // Convert image to base64
        const base64Image = buffer.toString('base64');

          // Create the prompt for Claude to extract market data
          const prompt = `
Please analyze this market statistics image and extract the following data:

1. PRICE PER SQUARE FOOT DATA:
   - Extract any pricing information including:
     * Average, Median, Low, High prices
     * Price per square foot values
     * List prices vs sold prices
     * Any price statistics

2. DAYS ON MARKET DATA:
   - Extract timing information including:
     * Days in MLS by time ranges (0-30, 31-60, 61-90, 91-120, 121+ days)
     * Average days on market
     * Number of listings in each time range
     * Percentage breakdowns

3. GENERAL MARKET DATA:
   - Number of listings/sales
   - Any other relevant statistics

Return the data as a JSON object with this structure:
{
  "priceData": {
    "averagePrice": number,
    "medianPrice": number,
    "lowPrice": number,
    "highPrice": number,
    "pricePerSqft": number,
    "averagePricePerSqft": number,
    "totalSales": number
  },
  "daysOnMarketData": {
    "averageDaysOnMarket": number,
    "medianDaysOnMarket": number,
    "timeRanges": {
      "0-30": { "count": number, "percentage": number },
      "31-60": { "count": number, "percentage": number },
      "61-90": { "count": number, "percentage": number },
      "91-120": { "count": number, "percentage": number },
      "121+": { "count": number, "percentage": number }
    }
  }
}

If certain data is not visible or available, use null or 0 as appropriate. Focus on extracting numerical data accurately.

Note: Do not try to extract the month/year/location from the image - these will be provided separately.
`;

          // Call Claude API to analyze the image
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: mimeType as any,
                      data: base64Image,
                    },
                  },
                  {
                    type: 'text',
                    text: prompt,
                  },
                ],
              },
            ],
          });

          // Parse Claude's response
          const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
          
          // Extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            
            // Process price per sqft data
            if (parsedData.priceData) {
              const priceEntry = {
                location: reportLocation,
                month: parseInt(reportMonth),
                year: parseInt(reportYear),
                pricePerSqft: parsedData.priceData.pricePerSqft || parsedData.priceData.averagePricePerSqft || 0,
                averagePrice: parsedData.priceData.averagePrice || 0,
                totalSales: parsedData.priceData.totalSales || 0,
                medianDaysOnMarket: parsedData.daysOnMarketData?.medianDaysOnMarket || null
              };
            
            if (priceEntry.pricePerSqft > 0) {
              extractedData.pricePerSqft.push(priceEntry);
            }
          }

            // Process days on market data
            if (parsedData.daysOnMarketData) {
              const daysEntry = {
                location: reportLocation,
                month: parseInt(reportMonth),
                year: parseInt(reportYear),
                averageDaysOnMarket: parsedData.daysOnMarketData.averageDaysOnMarket || 0,
                medianDaysOnMarket: parsedData.daysOnMarketData.medianDaysOnMarket || 0
              };
              
              if (daysEntry.averageDaysOnMarket > 0) {
                extractedData.daysOnMarket.push(daysEntry);
              }
            }
          }
      }

      res.json({
        success: true,
        message: 'Images processed successfully',
        data: extractedData
      });

    } catch (error) {
      console.error('Error processing images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process images',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

// Save extracted data to database
router.post('/save-extracted',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { pricePerSqft, daysOnMarket } = req.body;
    
    console.log('=== SAVE EXTRACTED DATA DEBUG ===');
    console.log('Received data:', { pricePerSqft, daysOnMarket });
    
    try {
      const results = [];
      const errors = [];

      // Save price per sqft data
      if (pricePerSqft && pricePerSqft.length > 0) {
        console.log(`Processing ${pricePerSqft.length} price per sqft entries`);
        for (const entry of pricePerSqft) {
          console.log('Inserting price entry:', entry);
          const { data, error } = await supabase
            .from('price_per_sqft_data')
            .insert({
              location: entry.location,
              month: entry.month,
              year: entry.year,
              price_per_sqft: entry.pricePerSqft,
              average_price: entry.averagePrice,
              total_sales: entry.totalSales,
              median_days_on_market: entry.medianDaysOnMarket ? Math.round(entry.medianDaysOnMarket) : null
            });

          if (error) {
            console.error('Error saving price per sqft data:', error);
            errors.push({ type: 'pricePerSqft', error: error.message, entry });
          } else {
            console.log('Successfully saved price entry:', data);
            results.push({ type: 'pricePerSqft', success: true });
          }
        }
      } else {
        console.log('No price per sqft data to save');
      }

      // Save days on market data
      if (daysOnMarket && daysOnMarket.length > 0) {
        console.log(`Processing ${daysOnMarket.length} days on market entries`);
        for (const entry of daysOnMarket) {
          console.log('Inserting days entry:', entry);
          const { data, error } = await supabase
            .from('days_on_market_data')
            .insert({
              location: entry.location,
              month: entry.month,
              year: entry.year,
              average_days_on_market: entry.averageDaysOnMarket,
              median_days_on_market: entry.medianDaysOnMarket ? Math.round(entry.medianDaysOnMarket) : null
            });

          if (error) {
            console.error('Error saving days on market data:', error);
            errors.push({ type: 'daysOnMarket', error: error.message, entry });
          } else {
            console.log('Successfully saved days entry:', data);
            results.push({ type: 'daysOnMarket', success: true });
          }
        }
      } else {
        console.log('No days on market data to save');
      }

      console.log('=== SAVE RESULTS ===');
      console.log('Successful saves:', results.length);
      console.log('Errors:', errors.length);

      // Return error if there were any database errors
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Failed to save ${errors.length} entries`,
          errors,
          partialSuccess: results.length > 0 ? results : undefined
        });
      }

      // Return error if no data was provided
      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid data was provided to save'
        });
      }

      res.json({
        success: true,
        message: `Successfully saved ${results.length} entries`,
        results
      });

    } catch (error) {
      console.error('Error saving extracted data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

export default router;