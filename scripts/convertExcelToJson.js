const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Leer el archivo Excel
const excelPath = path.join(__dirname, '../DatasetMedicamentos/gavade_20250305_091431.xlsx');
console.log('Intentando leer archivo:', excelPath);

const workbook = XLSX.readFile(excelPath);
console.log('Hojas disponibles:', workbook.SheetNames);

const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convertir a JSON
const datos = XLSX.utils.sheet_to_json(worksheet);

// Mostrar información de debug
console.log('\nPrimer registro del Excel:');
console.log(JSON.stringify(datos[0], null, 2));

console.log('\nNombres de columnas encontrados:');
if (datos.length > 0) {
  console.log(Object.keys(datos[0]));
}

// Formatear los datos
const medicamentos = datos.map((row, index) => {
  const medicamento = {
    nombre: row['MARCA COMERCIAL'] || '',
    principioActivo: row['PRINCIPIO ACTIVO'] || '',
    presentacion: row['PRESENTACION'] || '',
    laboratorio: row['LABORATORIO'] || '',
    precio: parseFloat(row['PVP PAMI AL 03/03/2025']?.replace('$', '').replace(',', '.')) || 0,
    cobertura: row['COBERTURA'] || '',
    importeAfiliado: parseFloat(row['IMPORTE AFILIADO']?.replace('$', '').replace(',', '.')) || 0,
    alfabeta: row['ALFABETA'] || ''
  };

  // Mostrar el primer y último registro procesado
  if (index === 0 || index === datos.length - 1) {
    console.log(`\nRegistro #${index + 1}:`);
    console.log(JSON.stringify(medicamento, null, 2));
  }

  return medicamento;
});

// Guardar como JSON
const jsonPath = path.join(__dirname, '../assets/medicamentos.json');
fs.writeFileSync(jsonPath, JSON.stringify(medicamentos, null, 2));

console.log(`\nArchivo JSON creado exitosamente en: ${jsonPath}`);
console.log('Total de medicamentos procesados:', medicamentos.length); 