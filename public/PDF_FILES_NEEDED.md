# PDF Files Required

To complete the PDF download feature, you need to create and place the following PDF files in the `/frontend/public/` directory:

1. **buyers-guide.pdf** - PDF version of the Buyers Guide
2. **sellers-guide.pdf** - PDF version of the Sellers Guide

## How to Create the PDFs:

### Option 1: Print to PDF from Browser
1. Open `/buyers-guide.html` in your browser
2. Press Ctrl+P (or Cmd+P on Mac)
3. Select "Save as PDF" as the destination
4. Save as `buyers-guide.pdf`
5. Repeat for `sellers-guide.html`

### Option 2: Use an Online HTML to PDF Converter
- Visit a service like https://www.web2pdfconvert.com/
- Enter the URL of your HTML file
- Download the generated PDF

### Option 3: Use a Professional Tool
- Adobe Acrobat
- wkhtmltopdf command line tool
- Chrome headless mode

## Important Notes:
- Place the PDF files in the same `/frontend/public/` directory as the HTML files
- The files should be named exactly: `buyers-guide.pdf` and `sellers-guide.pdf`
- Test the download functionality after adding the PDFs