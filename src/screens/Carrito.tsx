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
        <div style="color: #666;">
          <span style="font-style: italic;">Presentación: ${item.medicamento.presentacion}</span>
          <span style="margin-right: 20px;">- Principio Activo: ${item.medicamento.principioActivo}</span>
        </div>
        <div style="color: #666; margin-top: 5px;">
          <span style="color: #2089dc;">Cobertura: ${item.medicamento.cobertura || 'Sin cobertura'}</span>
        </div>
        <div style="margin-top: 5px;">
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
          <div style="margin-top: 20px; text-align: right;">
            <div style="font-size: 16px; color: #2089dc; margin-bottom: 10px;">
              Resumen de Coberturas:
              ${items.map(item => `
                <div style="margin-left: 20px; color: #666;">
                  ${item.medicamento.nombre} (${item.medicamento.presentacion}): ${item.medicamento.cobertura || 'Sin cobertura'}
                </div>
              `).join('')}
            </div>
            <div style="font-size: 18px; font-weight: bold;">
              Total: $${total.toFixed(2)}
            </div>
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
      <Card.Title style={styles.titulo}>{item.medicamento.nombre}</Card.Title>
      <Card.Divider />
      
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <View style={styles.columnLeft}>
            <Text style={styles.label}>Principio Activo:</Text>
            <Text style={styles.value}>{item.medicamento.principioActivo}</Text>
          </View>
          <View style={styles.columnRight}>
            <Text style={styles.label}>Presentación:</Text>
            <Text style={[styles.value, styles.presentacion]}>{item.medicamento.presentacion}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.columnLeft}>
            <Text style={styles.label}>Cobertura:</Text>
            <Text style={[styles.value, styles.cobertura]}>
              {item.medicamento.cobertura || 'Sin cobertura'}
            </Text>
          </View>
          <View style={styles.columnRight}>
            <Text style={styles.label}>Importe Afiliado:</Text>
            <Text style={[styles.value, styles.precio]}>
              ${item.medicamento.precio.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.columnLeft}>
            <Text style={styles.label}>Cantidad:</Text>
            <View style={styles.cantidadControles}>
              <Button
                title="-"
                titleStyle={styles.botonCantidadTexto}
                onPress={() => {
                  if (item.cantidad === 1) {
                    removerDelCarrito(item.medicamento.alfabeta);
                  } else {
                    actualizarCantidad(item.medicamento.alfabeta, item.cantidad - 1);
                  }
                }}
                buttonStyle={[styles.botonCantidad, styles.botonMenos]}
              />
              <Text style={styles.cantidadTexto}>{item.cantidad}</Text>
              <Button
                title="+"
                titleStyle={styles.botonCantidadTexto}
                onPress={() => actualizarCantidad(item.medicamento.alfabeta, item.cantidad + 1)}
                buttonStyle={[styles.botonCantidad, styles.botonMas]}
              />
            </View>
          </View>
          <View style={styles.columnRight}>
            <Text style={styles.subtotal}>
              Subtotal: ${(item.cantidad * item.medicamento.precio).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
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
        keyExtractor={(item) => item.medicamento.alfabeta}
        contentContainerStyle={styles.listContainer}
      />
      <Card containerStyle={styles.totalCard}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <Button
          title="Generar Presupuesto"
          onPress={generarYCompartirPDF}
          buttonStyle={styles.botonConfirmar}
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
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 18,
    textAlign: 'left',
  },
  infoContainer: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  columnLeft: {
    flex: 1,
    marginRight: 10,
  },
  columnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  cobertura: {
    color: '#2089dc',
    fontWeight: '500',
  },
  precio: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'right',
  },
  cantidadControles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cantidadTexto: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  botonCantidad: {
    width: 35,
    height: 35,
    padding: 0,
    borderRadius: 17.5,
  },
  botonMenos: {
    backgroundColor: '#dc3545',
  },
  botonMas: {
    backgroundColor: '#28a745',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2089dc',
    marginTop: 10,
    textAlign: 'right',
  },
  totalCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  botonCantidadTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  presentacion: {
    color: '#666',
    fontStyle: 'italic',
  },
});

export default Carrito; 