// Debug script to test pdf-parse import
async function testPdfParseImport() {
  console.log('=== Testing pdf-parse Import ===\n');
  
  try {
    console.log('1. Testing static import...');
    const pdfParseStatic = require('pdf-parse');
    console.log('✅ Static import successful');
    console.log('   Type:', typeof pdfParseStatic);
    console.log('   Is function:', typeof pdfParseStatic === 'function');
  } catch (error) {
    console.log('❌ Static import failed:', error.message);
  }
  
  try {
    console.log('\n2. Testing dynamic import...');
    const pdfParseDynamic = await import('pdf-parse');
    console.log('✅ Dynamic import successful');
    console.log('   Has default:', 'default' in pdfParseDynamic);
    console.log('   Default type:', typeof pdfParseDynamic.default);
    console.log('   Is function:', typeof pdfParseDynamic.default === 'function');
  } catch (error) {
    console.log('❌ Dynamic import failed:', error.message);
    console.log('   Error code:', error.code);
    console.log('   Error path:', error.path);
  }
  
  try {
    console.log('\n3. Testing with actual PDF file...');
    const fs = require('fs');
    const path = './knowledge-base.pdf';
    
    if (!fs.existsSync(path)) {
      console.log('❌ PDF file not found');
      return;
    }
    
    const buffer = fs.readFileSync(path);
    console.log('📄 PDF file loaded:', buffer.length, 'bytes');
    
    const pdfParse = require('pdf-parse');
    const result = await pdfParse(buffer);
    
    console.log('✅ PDF parsing successful');
    console.log('   Text length:', result.text.length);
    console.log('   Pages:', result.numpages);
    console.log('   Sample text:', result.text.substring(0, 100) + '...');
    
  } catch (error) {
    console.log('❌ PDF parsing failed:', error.message);
    console.log('   Stack:', error.stack);
  }
}

testPdfParseImport();