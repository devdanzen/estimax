import { NextResponse } from 'next/server';
import { getMaterials, createMaterial, searchMaterials } from '@/db/index.js';

// GET /api/materials - Get all materials with optional search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let materials;
    if (search) {
      // If search term provided, use search function
      materials = await searchMaterials(search);
    } else {
      // Get all materials with pagination
      materials = await getMaterials();
    }

    // Apply pagination
    const paginatedMaterials = materials.slice(offset, offset + limit);

    return NextResponse.json({
      materials: paginatedMaterials,
      total: materials.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST /api/materials - Create new material
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { mpg, activity, materialReference, description, priceList } = body;
    
    if (!mpg || !activity || !materialReference || !description || !priceList) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createMaterial({
      mpg,
      activity,
      materialReference,
      description,
      priceList: parseInt(priceList)
    });

    return NextResponse.json(
      { message: 'Material created successfully', result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    );
  }
}