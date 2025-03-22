import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, Button, Icon } from '@rneui/themed';
import { useCarrito } from '../context/CarritoContext';
import { ItemCarrito } from '../types/types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const Carrito = () => {
  const { items, removerDelCarrito, actualizarCantidad, limpiarCarrito, total } = useCarrito();

  const generarHTML = () => {
    const fecha = new Date().toLocaleDateString();
    
    const itemsHTML = items.map(item => `
      <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.medicamento.nombre}</div>
        <div style="color: #666;">${item.medicamento.principioActivo}</div>
        <div>
          Cantidad: ${item.cantidad} x $${item.medicamento.precio.toFixed(2)} = 
          $${(item.medicamento.precio * item.cantidad).toFixed(2)}
        </div>
      </div>
    `).join('');

    return `
      <html>
        <body style="padding: 20px; font-family: sans-serif;">
          <h1 style="text-align: center; color: #2089dc;">Presupuesto de Medicamentos</h1>
          <div style="text-align: right; color: #666; margin-bottom: 20px;">
            Fecha: ${fecha}
          </div>
          ${itemsHTML}
          <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold;">
            Total: $${total.toFixed(2)}
          </div>
        </body>
      </html>
    `;
  };

  const generarYCompartirPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generarHTML(),
        base64: false
      });
      
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'No se pudo generar el presupuesto. Por favor, intente nuevamente.');
    }
  };

  const renderItem = ({ item }: { item: ItemCarrito }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{item.medicamento.nombre}</Text>
          <Text style={styles.principioActivo}>{item.medicamento.principioActivo}</Text>
          <Text style={styles.precio}>${item.medicamento.precio.toFixed(2)} c/u</Text>
        </View>
        
        <View style={styles.cantidadContainer}>
          <Button
            icon={<Icon name="remove" size={20} color="white" />}
            onPress={() => actualizarCantidad(item.medicamento.alfabeta, item.cantidad - 1)}
            buttonStyle={styles.botonCantidad}
          />
          <Text style={styles.cantidad}>{item.cantidad}</Text>
          <Button
            icon={<Icon name="add" size={20} color="white" />}
            onPress={() => actualizarCantidad(item.medicamento.alfabeta, item.cantidad + 1)}
            buttonStyle={styles.botonCantidad}
          />
        </View>

        <Button
          icon={<Icon name="delete" size={24} color="white" />}
          onPress={() => removerDelCarrito(item.medicamento.alfabeta)}
          buttonStyle={styles.botonEliminar}
        />
      </View>
      <Text style={styles.subtotal}>
        Subtotal: ${(item.medicamento.precio * item.cantidad).toFixed(2)}
      </Text>
    </Card>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" type="font-awesome" size={50} color="#ccc" />
        <Text style={styles.emptyText}>El carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.medicamento.alfabeta}
        contentContainerStyle={styles.listContainer}
      />
      <Card containerStyle={styles.totalCard}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <Button
          title="Generar Presupuesto"
          onPress={generarYCompartirPDF}
          buttonStyle={styles.botonConfirmar}
          icon={{
            name: 'file-pdf-o',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          iconRight
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    margin: 10,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  principioActivo: {
    fontSize: 14,
    color: '#666',
  },
  precio: {
    fontSize: 14,
    color: '#28a745',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  botonCantidad: {
    padding: 5,
    margin: 5,
    backgroundColor: '#2089dc',
  },
  cantidad: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  botonEliminar: {
    padding: 10,
    backgroundColor: '#dc3545',
  },
  subtotal: {
    textAlign: 'right',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  botonConfirmar: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
});

export default Carrito; 