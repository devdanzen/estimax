import { NextResponse } from 'next/server';
import pdf from 'pdf-parse-new';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file' },
        { status: 400 }
      );
    }

    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF
    const data = await pdf(buffer);

    return NextResponse.json({
      text: data.text,
      numPages: data.numpages,
      metadata: data.metadata || {},
      info: {
        title: data.info?.Title || '',
        author: data.info?.Author || '',
        subject: data.info?.Subject || '',
        creator: data.info?.Creator || '',
        producer: data.info?.Producer || '',
        creationDate: data.info?.CreationDate || '',
        modificationDate: data.info?.ModDate || ''
      }
    });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse PDF file',
        details: error.message 
      },
      { status: 500 }
    );
  }
}