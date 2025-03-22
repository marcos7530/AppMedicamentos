import React, { createContext, useState, useContext } from 'react';
import { Medicamento, ItemCarrito, CarritoContextType } from '../types/types';

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const agregarAlCarrito = (medicamento: Medicamento) => {
    setItems(itemsActuales => {
      const itemExistente = itemsActuales.find(
        item => item.medicamento.alfabeta === medicamento.alfabeta
      );

      if (itemExistente) {
        return itemsActuales.map(item =>
          item.medicamento.alfabeta === medicamento.alfabeta
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...itemsActuales, { medicamento, cantidad: 1 }];
    });
  };

  const removerDelCarrito = (alfabeta: string) => {
    setItems(itemsActuales => 
      itemsActuales.filter(item => item.medicamento.alfabeta !== alfabeta)
    );
  };

  const actualizarCantidad = (alfabeta: string, cantidad: number) => {
    if (cantidad <= 0) {
      removerDelCarrito(alfabeta);
      return;
    }

    setItems(itemsActuales =>
      itemsActuales.map(item =>
        item.medicamento.alfabeta === alfabeta
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const limpiarCarrito = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.medicamento.precio * item.cantidad),
    0
  );

  const value = {
    items,
    agregarAlCarrito,
    removerDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    total
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
}; 