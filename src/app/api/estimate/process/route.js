import 'dotenv/config';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { formatExtractionPrompt } from '@/lib/ai-prompts';
import { matchAllMaterials } from '@/lib/material-matcher';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request) {
  try {
    const { pdfText } = await request.json();

    if (!pdfText) {
      return NextResponse.json(
        { error: 'PDF text is required' },
        { status: 400 }
      );
    }

    console.log('Processing PDF text with AI...');

    // Step 1: Extract materials using AI
    const prompt = formatExtractionPrompt(pdfText.substring(0, 4000)); // Limit text to avoid token limits

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a construction material extraction expert. Extract materials and return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temperature for more consistent extraction
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

    // Step 2: Match extracted materials with database
    const matchedMaterials = await matchAllMaterials(extractedData.materials);

    // Step 3: Calculate summary statistics
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
      summary
    });

  } catch (error) {
    console.error('Estimation processing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process estimation',
        details: error.message
      },
      { status: 500 }
    );
  }
}