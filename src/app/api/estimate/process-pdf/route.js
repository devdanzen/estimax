import 'dotenv/config';
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse-new';
import Groq from 'groq-sdk';
import { formatExtractionPrompt } from '@/lib/ai-prompts';
import { matchAllMaterials } from '@/lib/material-matcher';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request) {
  try {
    // Step 1: Parse PDF file
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

    console.log('Parsing PDF file...');
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);
    const pdfText = pdfData.text;

    console.log(`PDF parsed: ${pdfText.length} characters extracted`);

    // Step 2: Process with AI
    console.log('Processing with AI...');
    const prompt = formatExtractionPrompt(pdfText.substring(0, 10000)); // Increased limit for longer documents

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an electrical material extraction expert. Extract materials and return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No AI response generated');
    }

    console.log('AI extraction complete, parsing response...');

    // Parse AI response
    let extractedData;
    try {
      extractedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('AI returned invalid JSON');
    }

    if (!extractedData.materials || !Array.isArray(extractedData.materials)) {
      throw new Error('AI response missing materials array');
    }

    console.log(`Extracted ${extractedData.materials.length} materials, matching with database...`);

    // Step 3: Match with database
    const matchedMaterials = await matchAllMaterials(extractedData.materials);

    // Step 4: Calculate summary
    const summary = {
      totalItems: matchedMaterials.length,
      matchedItems: matchedMaterials.filter(m => m.bestMatch).length,
      unmatchedItems: matchedMaterials.filter(m => !m.bestMatch).length,
      totalValue: matchedMaterials.reduce((sum, item) => {
        const price = item.bestMatch?.priceList || 0;
        const qty = item.extracted.quantity || 1;
        return sum + (price * qty);
      }, 0)
    };

    return NextResponse.json({
      success: true,
      materials: matchedMaterials,
      summary,
      pdfText: pdfText, // Include raw text for optional display
      pdfInfo: {
        fileName: pdfFile.name,
        numPages: pdfData.numpages,
        textLength: pdfText.length
      }
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process PDF',
        details: error.message
      },
      { status: 500 }
    );
  }
}