import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SearchBar, Card, Text, Button, ButtonGroup } from '@rneui/themed';
import { Medicamento, FiltrosMedicamentos, TipoOrdenamiento, OpcionOrdenamiento } from '../types/types';

// Importar el JSON directamente
import medicamentosData from '../../assets/medicamentos.json';

type NavigationProps = {
  navigation: any;
};

const opcionesOrdenamiento: OpcionOrdenamiento[] = [
  { value: 'nombre-asc', label: 'Nombre ↑' },
  { value: 'nombre-desc', label: 'Nombre ↓' },
  { value: 'precio-asc', label: 'Precio ↑' },
  { value: 'precio-desc', label: 'Precio ↓' },
  { value: 'laboratorio-asc', label: 'Laboratorio ↑' },
  { value: 'laboratorio-desc', label: 'Laboratorio ↓' },
];

const BuscadorMedicamentos = ({ navigation }: NavigationProps) => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentosFiltrados, setMedicamentosFiltrados] = useState<Medicamento[]>([]);
  const [ordenamiento, setOrdenamiento] = useState<TipoOrdenamiento>('nombre-asc');
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
      setMedicamentosFiltrados(ordenarMedicamentos(data, ordenamiento));
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de medicamentos');
    }
  };

  const ordenarMedicamentos = (lista: Medicamento[], tipoOrdenamiento: TipoOrdenamiento): Medicamento[] => {
    const listaOrdenada = [...lista];
    
    switch (tipoOrdenamiento) {
      case 'nombre-asc':
        return listaOrdenada.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'nombre-desc':
        return listaOrdenada.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'precio-asc':
        return listaOrdenada.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return listaOrdenada.sort((a, b) => b.precio - a.precio);
      case 'laboratorio-asc':
        return listaOrdenada.sort((a, b) => a.laboratorio.localeCompare(b.laboratorio));
      case 'laboratorio-desc':
        return listaOrdenada.sort((a, b) => b.laboratorio.localeCompare(a.laboratorio));
      default:
        return listaOrdenada;
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

    setMedicamentosFiltrados(ordenarMedicamentos(resultados, ordenamiento));
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, medicamentos, ordenamiento]);

  const cambiarOrdenamiento = (index: number) => {
    setOrdenamiento(opcionesOrdenamiento[index].value);
  };

  const renderMedicamento = ({ item }: { item: Medicamento }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.nombre || 'Sin nombre'}</Card.Title>
      <Card.Divider />
      <View>
        <Text style={styles.label}>Principio Activo:</Text>
        <Text style={styles.value}>{item.principioActivo || 'No especificado'}</Text>
        
        <Text style={styles.label}>Presentación:</Text>
        <Text style={styles.value}>{item.presentacion || 'No especificada'}</Text>
        
        <Text style={styles.label}>Laboratorio:</Text>
        <Text style={styles.value}>{item.laboratorio || 'No especificado'}</Text>
        
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.value}>${typeof item.precio === 'number' ? item.precio.toFixed(2) : '0.00'}</Text>
        
        <Text style={styles.label}>Cobertura:</Text>
        <Text style={styles.value}>{item.cobertura || 'No especificada'}</Text>
        
        <Text style={styles.label}>Importe Afiliado:</Text>
        <Text style={styles.value}>${typeof item.importeAfiliado === 'number' ? item.importeAfiliado.toFixed(2) : '0.00'}</Text>
        
        <Text style={styles.label}>Alfabeta:</Text>
        <Text style={styles.value}>{item.alfabeta || 'No especificado'}</Text>
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
      <ButtonGroup
        buttons={opcionesOrdenamiento.map(opcion => opcion.label)}
        selectedIndex={opcionesOrdenamiento.findIndex(opcion => opcion.value === ordenamiento)}
        onPress={cambiarOrdenamiento}
        containerStyle={styles.buttonGroup}
        textStyle={styles.buttonGroupText}
        buttonContainerStyle={styles.buttonContainer}
        innerBorderStyle={{ width: 0.5 }}
      />
      <Text style={styles.resultados}>
        Resultados encontrados: {medicamentosFiltrados.length}
      </Text>
      <FlatList
        data={medicamentosFiltrados}
        renderItem={renderMedicamento}
        keyExtractor={(item, index) => `${item.alfabeta}-${item.nombre}-${index}`}
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
  buttonGroup: {
    marginHorizontal: 10,
    marginBottom: 10,
    height: 40,
    borderRadius: 8,
  },
  buttonGroupText: {
    fontSize: 12,
  },
  buttonContainer: {
    borderRadius: 8,
  },
  resultados: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
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