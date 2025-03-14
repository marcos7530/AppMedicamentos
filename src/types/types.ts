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

export type TipoOrdenamiento = 'nombre-asc' | 'nombre-desc' | 'precio-asc' | 'precio-desc' | 'laboratorio-asc' | 'laboratorio-desc';

export interface OpcionOrdenamiento {
  value: TipoOrdenamiento;
  label: string;
} 