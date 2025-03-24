import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from '@rneui/themed';
import { Medicamento } from '../types/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Buscador: undefined;
  Detalle: { medicamento: Medicamento };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

const DetalleMedicamento = ({ route }: Props) => {
  const { medicamento } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.titulo}>{medicamento.nombre}</Card.Title>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.valor}>${medicamento.precio}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Laboratorio:</Text>
          <Text style={styles.valor}>{medicamento.laboratorio}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Presentación:</Text>
          <Text style={styles.valor}>{medicamento.presentacion}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.valor}>{medicamento.alfabeta}</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    margin: 15,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 120,
  },
  valor: {
    fontSize: 16,
    flex: 1,
  },
});

export default DetalleMedicamento; 