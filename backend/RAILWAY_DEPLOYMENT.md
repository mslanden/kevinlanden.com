# Railway Deployment Setup for Newsletter Generation

## Environment Variables to Add in Railway

Add the following environment variable to your Railway deployment:

### LlamaParse API Key
```
LLAMA_CLOUD_API_KEY=llx-tixLWsup8gpuEr4ZgrTqBJqScfLPsPM0GAsu2wiGFwa9Qa7j
```

## How to Add to Railway

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to the "Variables" tab
4. Click "New Variable"
5. Add:
   - **Key**: `LLAMA_CLOUD_API_KEY`
   - **Value**: `llx-tixLWsup8gpuEr4ZgrTqBJqScfLPsPM0GAsu2wiGFwa9Qa7j`
6. Click "Add" and redeploy

## Testing the Integration

Once deployed, the newsletter generator will be available at:
- **Upload endpoint**: `POST /api/newsletter/process-mls`
- **PDF generation**: `POST /api/newsletter/generate-pdf`

Both endpoints require admin authentication.

## Next Steps After Deployment

1. Test the file upload functionality in the admin interface
2. Upload sample MLS PDFs to verify data extraction
3. Check Railway logs for any LlamaParse processing errors
4. Fine-tune the parsing instructions if needed

## Monitoring

Monitor the Railway logs to see:
- File processing attempts
- LlamaParse API responses
- Any extraction errors or successes