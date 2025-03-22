import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SearchBar, Card, Text, Button, ButtonGroup, Icon } from '@rneui/themed';
import { Medicamento, FiltrosMedicamentos, TipoOrdenamiento, OpcionOrdenamiento } from '../types/types';
import { useCarrito } from '../context/CarritoContext';

// Importar el JSON directamente
import medicamentosData from '../../assets/medicamentos.json';

type NavigationProps = {
  navigation: any;
};

const opcionesOrdenamiento: OpcionOrdenamiento[] = [
  { value: 'nombre-asc', label: 'Nombre ↑' },
  { value: 'nombre-desc', label: 'Nombre ↓' },
  { value: 'principio-asc', label: 'Principio ↑' },
  { value: 'principio-desc', label: 'Principio ↓' },
  { value: 'precio-asc', label: 'Precio ↑' },
  { value: 'precio-desc', label: 'Precio ↓' },
];

const BuscadorMedicamentos = ({ navigation }: NavigationProps) => {
  const { agregarAlCarrito } = useCarrito();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentosFiltrados, setMedicamentosFiltrados] = useState<Medicamento[]>([]);
  const [ordenamiento, setOrdenamiento] = useState<TipoOrdenamiento>('nombre-asc');
  const [filtros, setFiltros] = useState<FiltrosMedicamentos>({
    busqueda: '',
    modoBusqueda: 'nombre',
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
      case 'principio-asc':
        return listaOrdenada.sort((a, b) => a.principioActivo.localeCompare(b.principioActivo));
      case 'principio-desc':
        return listaOrdenada.sort((a, b) => b.principioActivo.localeCompare(a.principioActivo));
      case 'precio-asc':
        return listaOrdenada.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return listaOrdenada.sort((a, b) => b.precio - a.precio);
      default:
        return listaOrdenada;
    }
  };

  const aplicarFiltros = () => {
    const resultados = medicamentos.filter(med => {
      const textoBusqueda = filtros.busqueda.toLowerCase();
      const cumpleBusqueda = filtros.modoBusqueda === 'nombre' 
        ? med.nombre.toLowerCase().includes(textoBusqueda)
        : med.principioActivo.toLowerCase().includes(textoBusqueda);
      
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
        
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.value}>${typeof item.precio === 'number' ? item.precio.toFixed(2) : '0.00'}</Text>
      </View>
      <View style={styles.botonesContainer}>
        <Button
          title="Ver Detalle"
          onPress={() => navigation.navigate('Detalle', { medicamento: item })}
          containerStyle={styles.botonContainer}
          buttonStyle={styles.botonDetalle}
        />
        <Button
          title="Agregar al Carrito"
          onPress={() => {
            agregarAlCarrito(item);
            Alert.alert('Éxito', 'Medicamento agregado al carrito');
          }}
          containerStyle={styles.botonContainer}
          buttonStyle={styles.botonCarrito}
          icon={{
            name: 'shopping-cart',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          iconRight
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={`Buscar por ${filtros.modoBusqueda === 'nombre' ? 'nombre' : 'principio activo'}...`}
          onChangeText={(texto: string) => setFiltros({ ...filtros, busqueda: texto })}
          value={filtros.busqueda}
          platform="default"
          containerStyle={styles.searchBar}
        />
        <ButtonGroup
          buttons={['Nombre', 'Principio']}
          selectedIndex={filtros.modoBusqueda === 'nombre' ? 0 : 1}
          onPress={(index) => setFiltros({ ...filtros, modoBusqueda: index === 0 ? 'nombre' : 'principio' })}
          containerStyle={styles.searchModeGroup}
          textStyle={styles.searchModeText}
        />
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchModeGroup: {
    width: 150,
    height: 40,
    borderRadius: 8,
  },
  searchModeText: {
    fontSize: 12,
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
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  botonDetalle: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
  },
  botonCarrito: {
    backgroundColor: '#28a745',
    borderRadius: 8,
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