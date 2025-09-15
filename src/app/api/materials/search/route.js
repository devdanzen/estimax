import { NextResponse } from 'next/server';
import { searchMaterials, searchByReference } from '@/db/index.js';

// GET /api/materials/search?q=term&type=description|reference
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'description';
    const limit = parseInt(searchParams.get('limit')) || 20;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }

    let results;
    
    if (type === 'reference') {
      results = await searchByReference(query);
    } else {
      results = await searchMaterials(query);
    }

    // Limit results
    const limitedResults = results.slice(0, limit);

    return NextResponse.json({
      results: limitedResults,
      total: results.length,
      query,
      type,
      limit
    });
  } catch (error) {
    console.error('Error searching materials:', error);
    return NextResponse.json(
      { error: 'Failed to search materials' },
      { status: 500 }
    );
  }
}