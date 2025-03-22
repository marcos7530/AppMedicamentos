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
  modoBusqueda: 'nombre' | 'principio';
  laboratorio?: string;
  precioMin?: number;
  precioMax?: number;
}

export type TipoOrdenamiento = 'nombre-asc' | 'nombre-desc' | 'principio-asc' | 'principio-desc' | 'precio-asc' | 'precio-desc';

export interface OpcionOrdenamiento {
  value: TipoOrdenamiento;
  label: string;
} 