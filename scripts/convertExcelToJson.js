const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Función para limpiar y convertir valores numéricos
const limpiarValorNumerico = (valor) => {
  if (!valor) return 0;
  if (typeof valor === 'number') return valor;
  return parseFloat(valor.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
};

// Leer el archivo Excel
const excelPath = path.join(__dirname, '../assets/gavade_20250305_091431.xlsx');
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
  // Debug
  if (index === 0) {
    console.log('\nDatos crudos del primer registro:');
    console.log(row);
  }

  const medicamento = {
    nombre: row['MARCA COMERCIAL']?.toString().trim() || '',
    principioActivo: row['PRINCIPIO ACTIVO']?.toString().trim() || '',
    presentacion: row['PRESENTACION']?.toString().trim() || '',
    laboratorio: row['LABORATORIO']?.toString().trim() || '',
    precio: limpiarValorNumerico(row['PVP PAMI AL 03/03/2025']),
    cobertura: row['COBERTURA']?.toString().trim() || '',
    importeAfiliado: limpiarValorNumerico(row['IMPORTE AFILIADO']),
    alfabeta: row['ALFABETA']?.toString().trim() || ''
  };

  // Mostrar el primer y último registro procesado
  if (index === 0 || index === datos.length - 1) {
    console.log(`\nRegistro #${index + 1} procesado:`);
    console.log(JSON.stringify(medicamento, null, 2));
  }

  return medicamento;
});

// Verificar que tenemos datos
if (medicamentos.length === 0) {
  console.error('No se encontraron datos en el archivo Excel');
  process.exit(1);
}

// Guardar como JSON
const jsonPath = path.join(__dirname, '../assets/medicamentos.json');
fs.writeFileSync(jsonPath, JSON.stringify(medicamentos, null, 2));

console.log(`\nArchivo JSON creado exitosamente en: ${jsonPath}`);
console.log('Total de medicamentos procesados:', medicamentos.length); 