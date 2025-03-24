import * as XLSX from 'xlsx';
import { Medicamento } from '../types/types';

export const cargarMedicamentosDesdeExcel = async (archivo: ArrayBuffer): Promise<Medicamento[]> => {
  try {
    const workbook = XLSX.read(archivo, { type: 'array' });
    const primerHoja = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[primerHoja];
    
    const datos = XLSX.utils.sheet_to_json(worksheet);
    
    return datos.map((row: any) => ({
      nombre: row.nombre || '',
      precio: parseFloat(row.precio) || 0,
      laboratorio: row.laboratorio || '',
      presentacion: row.presentacion || '',
      principioActivo: row.principioActivo || '',
      cobertura: row.cobertura || '',
      importeAfiliado: parseFloat(row.importeAfiliado) || 0,
      alfabeta: row.alfabeta || '',
      categoria: row.categoria || '',
    }));
  } catch (error) {
    console.error('Error al procesar el archivo Excel:', error);
    throw new Error('No se pudo procesar el archivo Excel');
  }
};

export const validarFormatoExcel = (medicamentos: Medicamento[]): boolean => {
  if (!medicamentos || medicamentos.length === 0) {
    return false;
  }

  return medicamentos.every(med => 
    typeof med.nombre === 'string' &&
    typeof med.precio === 'number' &&
    typeof med.laboratorio === 'string' &&
    typeof med.presentacion === 'string'
  );
}; 