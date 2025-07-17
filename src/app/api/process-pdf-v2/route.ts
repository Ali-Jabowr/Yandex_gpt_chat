import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to dynamically import pdf-parse
    let pdfParse;
    try {
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default;
    } catch (importError) {
      console.error('Failed to import pdf-parse:', importError);
      return NextResponse.json({ error: 'PDF parsing module not available' }, { status: 500 });
    }

    // Parse PDF
    const pdfData = await pdfParse(buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json({ error: 'No text found in PDF' }, { status: 400 });
    }

    return NextResponse.json({
      text: pdfData.text,
      method: 'pdf-parse',
      pages: pdfData.numpages,
      info: pdfData.info
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
}