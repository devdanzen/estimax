import 'dotenv/config';
import { NextResponse } from 'next/server';
import { getMaterialById } from '@/db/index.js';
import { sql } from '@vercel/postgres';

// GET /api/materials/[id] - Get single material by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      );
    }

    const material = await getMaterialById(id);
    
    if (!material || material.length === 0) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(material[0]);
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json(
      { error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
}

// PUT /api/materials/[id] - Update material
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      );
    }

    const { mpg, activity, materialReference, description, priceList } = body;

    const result = await sql`
      UPDATE materials 
      SET 
        mpg = ${mpg},
        activity = ${activity},
        material_reference = ${materialReference},
        description = ${description},
        price_list = ${parseInt(priceList)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Material updated successfully',
      material: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

// DELETE /api/materials/[id] - Delete material
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID parameter' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM materials 
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Material deleted successfully',
      material: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}