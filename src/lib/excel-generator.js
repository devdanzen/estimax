import ExcelJS from 'exceljs';

export async function generateEstimationExcel(estimationData) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Material Estimation');

  // Define columns
  worksheet.columns = [
    { header: 'No', key: 'no', width: 8 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Brand', key: 'brand', width: 15 },
    { header: 'Reference', key: 'reference', width: 20 },
    { header: 'Qty', key: 'qty', width: 10 },
    { header: 'Unit Price', key: 'unitPrice', width: 15 },
    { header: 'Total Price', key: 'totalPrice', width: 15 }
  ];

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' } // Blue background
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 25;

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });

  // Add data rows
  let grandTotal = 0;
  let rowNumber = 1;

  for (const item of estimationData) {
    const quantity = item.quantity || 1;
    const unitPrice = item.unitPrice || 0;
    const totalPrice = quantity * unitPrice;
    grandTotal += totalPrice;

    const dataRow = worksheet.addRow({
      no: rowNumber++,
      description: item.description || '',
      brand: item.brand || '',
      reference: item.reference || '',
      qty: quantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice
    });

    // Apply borders to data rows
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
      };
    });

    // Align numbers
    dataRow.getCell('no').alignment = { horizontal: 'center' };
    dataRow.getCell('qty').alignment = { horizontal: 'center' };
    dataRow.getCell('unitPrice').alignment = { horizontal: 'right' };
    dataRow.getCell('unitPrice').numFmt = '#,##0';
    dataRow.getCell('totalPrice').alignment = { horizontal: 'right' };
    dataRow.getCell('totalPrice').numFmt = '#,##0';
  }

  // Add empty row
  worksheet.addRow([]);

  // Add grand total row
  const totalRow = worksheet.addRow({
    no: '',
    description: 'GRAND TOTAL',
    brand: '',
    reference: '',
    qty: '',
    unitPrice: '',
    totalPrice: grandTotal
  });

  // Style grand total row
  totalRow.font = { bold: true, size: 12 };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF3F4F6' } // Light gray background
  };

  totalRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF000000' } },
      left: { style: 'medium', color: { argb: 'FF000000' } },
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
      right: { style: 'medium', color: { argb: 'FF000000' } }
    };
  });

  totalRow.getCell('description').alignment = { horizontal: 'left' };
  totalRow.getCell('totalPrice').alignment = { horizontal: 'right' };
  totalRow.getCell('totalPrice').numFmt = '#,##0';

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export function parseEstimationForExcel(matchedMaterials) {
  const excelData = [];

  for (const item of matchedMaterials) {
    const bestMatch = item.bestMatch;
    const extracted = item.extracted;

    excelData.push({
      description: extracted.description || '',
      brand: extracted.brand || bestMatch?.mpg || '',
      reference: bestMatch?.materialReference || extracted.possibleReferences?.[0] || '',
      quantity: extracted.quantity || 1,
      unitPrice: bestMatch?.priceList || 0,
      totalPrice: (extracted.quantity || 1) * (bestMatch?.priceList || 0)
    });
  }

  return excelData;
}