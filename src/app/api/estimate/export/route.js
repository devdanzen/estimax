import { NextResponse } from 'next/server';
import { generateEstimationExcel, parseEstimationForExcel } from '@/lib/excel-generator';

export async function POST(request) {
  try {
    const { materials } = await request.json();

    if (!materials || !Array.isArray(materials)) {
      return NextResponse.json(
        { error: 'Materials data is required' },
        { status: 400 }
      );
    }

    // Parse materials for Excel format
    const excelData = parseEstimationForExcel(materials);

    // Generate Excel file (now async)
    const buffer = await generateEstimationExcel(excelData);

    // Create response with Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="material_estimation_${Date.now()}.xlsx"`
      }
    });

  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate Excel file',
        details: error.message
      },
      { status: 500 }
    );
  }
}