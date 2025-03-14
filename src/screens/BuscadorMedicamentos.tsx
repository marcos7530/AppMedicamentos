import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SearchBar, Card, Text, Button } from '@rneui/themed';
import { Medicamento, FiltrosMedicamentos } from '../types/types';

// Importar el JSON directamente
import medicamentosData from '../../assets/medicamentos.json';

type NavigationProps = {
  navigation: any;
};

const BuscadorMedicamentos = ({ navigation }: NavigationProps) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentosFiltrados, setMedicamentosFiltrados] = useState<Medicamento[]>([]);
  const [filtros, setFiltros] = useState<FiltrosMedicamentos>({
    busqueda: '',
    laboratorio: undefined,
    precioMin: undefined,
    precioMax: undefined
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = require('../../assets/medicamentos.json');
      setMedicamentos(data);
      setMedicamentosFiltrados(data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de medicamentos');
    }
  };

  const aplicarFiltros = () => {
    const resultados = medicamentos.filter(med => {
      const cumpleBusqueda = med.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                            med.principioActivo.toLowerCase().includes(filtros.busqueda.toLowerCase());
      const cumpleLaboratorio = !filtros.laboratorio || med.laboratorio === filtros.laboratorio;
      const cumplePrecioMin = !filtros.precioMin || med.precio >= filtros.precioMin;
      const cumplePrecioMax = !filtros.precioMax || med.precio <= filtros.precioMax;

      return cumpleBusqueda && cumpleLaboratorio && cumplePrecioMin && cumplePrecioMax;
    });

    setMedicamentosFiltrados(resultados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, medicamentos]);

  const renderMedicamento = ({ item }: { item: Medicamento }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.nombre}</Card.Title>
      <Card.Divider />
      <View>
        <Text style={styles.label}>Principio Activo:</Text>
        <Text style={styles.value}>{item.principioActivo}</Text>
        
        <Text style={styles.label}>Presentación:</Text>
        <Text style={styles.value}>{item.presentacion}</Text>
        
        <Text style={styles.label}>Laboratorio:</Text>
        <Text style={styles.value}>{item.laboratorio}</Text>
        
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.value}>${item.precio.toFixed(2)}</Text>
        
        <Text style={styles.label}>Cobertura:</Text>
        <Text style={styles.value}>{item.cobertura}</Text>
        
        <Text style={styles.label}>Importe Afiliado:</Text>
        <Text style={styles.value}>${item.importeAfiliado.toFixed(2)}</Text>
        
        <Text style={styles.label}>Alfabeta:</Text>
        <Text style={styles.value}>{item.alfabeta}</Text>
      </View>
      <Button
        title="Ver Detalle"
        onPress={() => navigation.navigate('Detalle', { medicamento: item })}
        style={styles.botonDetalle}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar medicamentos..."
        onChangeText={(texto: string) => setFiltros({ ...filtros, busqueda: texto })}
        value={filtros.busqueda}
        platform="default"
        containerStyle={styles.searchBar}
      />
      <FlatList
        data={medicamentosFiltrados}
        renderItem={renderMedicamento}
        keyExtractor={(item) => item.nombre}
        style={styles.lista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  lista: {
    flex: 1,
  },
  botonDetalle: {
    marginTop: 10,
  },
  card: {
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 10,
  },
});

export default BuscadorMedicamentos; 