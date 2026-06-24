import * as XLSX from 'xlsx';
import * as path from 'path';

export class ExcelReader {

  static readExcelData(filePath: string, sheetName: string): any[] {
    
    // Load the Excel file
    const workbook = XLSX.readFile(
      path.resolve(process.cwd(), filePath)
    );

    // Get the sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(` Read ${data.length} rows from Excel!`);
    return data;
  }
}