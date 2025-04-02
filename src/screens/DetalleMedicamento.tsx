import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCarrito } from '../context/CarritoContext';

type RootStackParamList = {
  Home: undefined;
  BuscadorMedicamentos: undefined;
  Carrito: undefined;
  DetalleMedicamento: { medicamento: any };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleMedicamento'>;

export default function DetalleMedicamento({ route, navigation }: Props) {
  const { medicamento } = route.params;
  const { agregarAlCarrito } = useCarrito();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{medicamento.nombre}</Text>
        <Text style={styles.subtitle}>Principio Activo: {medicamento.principio_activo}</Text>
        <Text style={styles.subtitle}>Presentación: {medicamento.presentacion}</Text>
        <Text style={styles.subtitle}>Cobertura: {medicamento.cobertura}%</Text>
        <Text style={styles.price}>Precio: ${medicamento.precio}</Text>
        <Text style={styles.alfabeta}>Categoría Alfabeta: {medicamento.alfabeta}</Text>
        
        <Button
          title="Agregar al Carrito"
          onPress={() => {
            agregarAlCarrito(medicamento);
            Alert.alert('Éxito', 'Medicamento agregado al carrito');
          }}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2089dc',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2089dc',
    marginVertical: 10,
  },
  alfabeta: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
}); 