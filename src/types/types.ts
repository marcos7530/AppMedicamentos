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

export interface ItemCarrito {
  medicamento: Medicamento;
  cantidad: number;
}

export interface CarritoContextType {
  items: ItemCarrito[];
  agregarAlCarrito: (medicamento: Medicamento) => void;
  removerDelCarrito: (alfabeta: string) => void;
  actualizarCantidad: (alfabeta: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  total: number;
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