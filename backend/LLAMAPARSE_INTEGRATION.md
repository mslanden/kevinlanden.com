# LlamaParse Integration for MLS Data Extraction

## Setup Instructions

### 1. Install LlamaParse SDK
```bash
cd backend
npm install llamaindex
```

### 2. Environment Variables
Add to your `.env` file:
```
LLAMA_CLOUD_API_KEY=your_api_key_here
```

### 3. Get API Key
1. Go to https://cloud.llamaindex.ai/
2. Sign up/login
3. Get your API key from the dashboard

## Implementation

### Update the processMLSFiles function:

```typescript
import { LlamaParseReader } from 'llamaindex';

async function processMLSFiles(files: Express.Multer.File[], community: string): Promise<MLSData> {
  const reader = new LlamaParseReader({
    apiKey: process.env.LLAMA_CLOUD_API_KEY,
    resultType: 'json', // Get structured JSON output
    parsingInstruction: `
      Extract real estate data from MLS reports. Focus on:
      
      1. Property listings table with columns: MLS#, Status, Price, Address, Beds, Baths, Sq Ft, Year Built
      2. Market summary statistics: unit sales, median price, inventory, days on market
      3. Status breakdown: active, pending, closed, other listings
      4. Price range distribution
      
      Format as structured JSON with clear property listings array and summary statistics.
      For ${community} area specifically.
    `
  });

  let allData: MLSData = {
    listings: [],
    summary: {
      unitSales: '',
      medianPrice: '',
      inventory: '',
      daysOnMarket: '',
      quickAnalysis: ''
    },
    statusSummary: {
      active: 0,
      pending: 0,
      closed: 0,
      other: 0
    },
    priceRanges: []
  };

  // Process each uploaded PDF
  for (const file of files) {
    try {
      // Convert buffer to blob/file for LlamaParse
      const documents = await reader.loadDataAsContent([file.buffer]);
      
      // Parse the extracted content
      const parsedData = parseMLSContent(documents[0].text);
      
      // Merge data from multiple files
      allData = mergeMLSData(allData, parsedData);
      
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
    }
  }

  return allData;
}

function parseMLSContent(content: string): Partial<MLSData> {
  // Parse the LlamaParse output and extract structured data
  // This function would contain logic to:
  // 1. Extract property listings from tables
  // 2. Parse summary statistics
  // 3. Calculate status breakdowns
  // 4. Organize price ranges
  
  // Implementation depends on the exact format LlamaParse returns
  return {};
}

function mergeMLSData(existing: MLSData, newData: Partial<MLSData>): MLSData {
  // Combine data from multiple PDF files
  return {
    listings: [...existing.listings, ...(newData.listings || [])],
    summary: { ...existing.summary, ...newData.summary },
    statusSummary: {
      active: existing.statusSummary.active + (newData.statusSummary?.active || 0),
      pending: existing.statusSummary.pending + (newData.statusSummary?.pending || 0),
      closed: existing.statusSummary.closed + (newData.statusSummary?.closed || 0),
      other: existing.statusSummary.other + (newData.statusSummary?.other || 0)
    },
    priceRanges: mergePriceRanges(existing.priceRanges, newData.priceRanges || [])
  };
}
```

## Expected Data Structure from MLS PDFs

Based on the images you provided, LlamaParse should extract:

### 1. Property Listings Table
```json
{
  "listings": [
    {
      "mls": "219113554",
      "status": "Closed",
      "price": "$1,210,000",
      "address": "25705 Tahquitz Drive",
      "beds": 5,
      "baths": 4,
      "sqft": 2200,
      "yearBuilt": 1975
    }
  ]
}
```

### 2. Market Summary Statistics
```json
{
  "summary": {
    "unitSales": "89",
    "medianPrice": "$620k", 
    "inventory": "447",
    "daysOnMarket": "63",
    "quickAnalysis": "Market is down 23.6% for March..."
  }
}
```

### 3. Status Breakdown (from pie chart)
```json
{
  "statusSummary": {
    "active": 118,
    "pending": 0, 
    "closed": 9,
    "other": 11
  }
}
```

## Testing

1. Upload sample MLS PDFs through the admin interface
2. Check browser network tab for API calls to `/newsletter/process-mls`
3. Verify extracted data structure matches expected format
4. Test chart generation with real data

## Fallback Strategy

If LlamaParse doesn't extract data perfectly:
1. Allow manual data entry in the form
2. Use LlamaParse output as a starting point
3. Kevin can review and edit extracted data before generating newsletter