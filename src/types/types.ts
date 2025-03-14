export interface Medicamento {
  nombre: string;
  principioActivo: string;
  presentacion: string;
  laboratorio: string;
  precio: number;
  cobertura: string;
  importeAfiliado: number;
  alfabeta: string;
}

export interface FiltrosMedicamentos {
  busqueda: string;
  laboratorio?: string;
  precioMin?: number;
  precioMax?: number;
} 