// Simple script to create a test PDF using pdf-lib
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createTestPdf() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([600, 400]);
  
  // Add some text
  page.drawText('Hello World!', {
    x: 50,
    y: 350,
    size: 30,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('This is a test PDF document.', {
    x: 50,
    y: 300,
    size: 16,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('It contains extractable text for testing the PDF processing API.', {
    x: 50,
    y: 270,
    size: 14,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('This document should work with pdf-parse and pdf2json.', {
    x: 50,
    y: 240,
    size: 12,
    color: rgb(0, 0, 0),
  });
  
  // Save the PDF with no compression to avoid issues
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false
  });
  fs.writeFileSync('test-document.pdf', pdfBytes);
  
  console.log('Test PDF created: test-document.pdf');
}

createTestPdf().catch(console.error);