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
    // Si no hay texto de búsqueda, mostrar lista vacía
    if (!filtros.busqueda.trim()) {
      setMedicamentosFiltrados([]);
      return;
    }

    const resultados = medicamentos.filter(med => {
      const textoBusqueda = filtros.busqueda.toLowerCase().trim();
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
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.nombre}>{item.nombre}</Text>
        </View>
        
        <View style={styles.contentRow}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Presentación:</Text>
              <Text style={styles.value}>{item.presentacion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Principio Activo:</Text>
              <Text style={styles.value}>{item.principioActivo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cobertura:</Text>
              <Text style={[styles.value, styles.cobertura]}>{item.cobertura || 'Sin cobertura'}</Text>
            </View>
          </View>

          <View style={styles.precioColumn}>
            <Text style={styles.label}>Importe Afiliado:</Text>
            <Text style={styles.importeAfiliado}>
              ${typeof item.importeAfiliado === 'number' ? item.importeAfiliado.toFixed(2) : '0.00'}
            </Text>
            <Button
              title="Agregar al Carrito"
              onPress={() => {
                const medicamentoConImporteAfiliado = {
                  ...item,
                  precio: item.importeAfiliado || 0
                };
                agregarAlCarrito(medicamentoConImporteAfiliado);
                Alert.alert(
                  'Medicamento Agregado',
                  `${item.nombre}\nPresentación: ${item.presentacion}\nCobertura: ${item.cobertura || 'Sin cobertura'}\nImporte Afiliado: $${(item.importeAfiliado || 0).toFixed(2)}`,
                  [{ text: 'OK' }]
                );
              }}
              buttonStyle={styles.botonAgregar}
              icon={{
                name: 'shopping-cart',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
            />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="search"
        type="font-awesome"
        size={50}
        color="#ccc"
      />
      <Text style={styles.emptyText}>
        {filtros.busqueda.trim() 
          ? "No se encontraron medicamentos"
          : "Escribe en el buscador para ver medicamentos"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={`Buscar por ${filtros.modoBusqueda === 'nombre' ? 'nombre comercial' : 'principio activo'}...`}
          onChangeText={(texto: string) => setFiltros({ ...filtros, busqueda: texto })}
          value={filtros.busqueda}
          platform="default"
          containerStyle={styles.searchBar}
          inputContainerStyle={{ backgroundColor: 'transparent' }}
          inputStyle={{ color: '#333', fontSize: 16 }}
          searchIcon={{ color: '#2089dc' }}
          clearIcon={{ color: '#2089dc' }}
          placeholderTextColor="#999"
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
      {medicamentosFiltrados.length > 0 && (
        <Text style={styles.resultados}>
          Resultados encontrados: {medicamentosFiltrados.length}
        </Text>
      )}
      <FlatList
        data={medicamentosFiltrados}
        renderItem={renderMedicamento}
        keyExtractor={(item, index) => `${item.alfabeta}-${item.nombre}-${index}`}
        style={styles.lista}
        ListEmptyComponent={renderEmptyState}
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
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchModeGroup: {
    marginHorizontal: 0,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2089dc',
    backgroundColor: '#fff',
  },
  searchModeText: {
    fontSize: 14,
    color: '#2089dc',
  },
  buttonGroup: {
    marginHorizontal: 15,
    marginVertical: 10,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2089dc',
    backgroundColor: '#fff',
  },
  buttonGroupText: {
    fontSize: 12,
    color: '#2089dc',
  },
  buttonContainer: {
    borderRadius: 12,
  },
  resultados: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  lista: {
    flex: 1,
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
  cardContent: {
    flex: 1,
  },
  headerRow: {
    marginBottom: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 2.5,
    marginRight: 10,
  },
  infoRow: {
    marginBottom: 6,
  },
  precioColumn: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 1,
  },
  value: {
    fontSize: 14,
  },
  cobertura: {
    color: '#2089dc',
    fontWeight: '500',
  },
  importeAfiliado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  botonAgregar: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default BuscadorMedicamentos; 