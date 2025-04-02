import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { medicamentosService } from './src/services/medicamentosService';
import { Alert } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { CarritoProvider } from './src/context/CarritoContext';

// Importar pantallas
import HomeScreen from './src/screens/HomeScreen';
import BuscadorMedicamentos from './src/screens/BuscadorMedicamentos';
import Carrito from './src/screens/Carrito';
import DetalleMedicamento from './src/screens/DetalleMedicamento';

type RootStackParamList = {
  Home: undefined;
  BuscadorMedicamentos: undefined;
  Carrito: undefined;
  DetalleMedicamento: { medicamento: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarActualizacion = async () => {
      try {
        const { message } = await medicamentosService.verificarActualizacion();
        Alert.alert('Estado de Actualización', message);
      } catch (error) {
        console.error('Error al verificar actualización:', error);
        Alert.alert(
          'Error',
          'No se pudo verificar la actualización del listado de medicamentos.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verificarActualizacion();
  }, []);

  if (isLoading) {
    return null; // O un componente de carga si lo prefieres
  }

  return (
    <CarritoProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2089dc',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Inicio' }}
          />
          <Stack.Screen 
            name="BuscadorMedicamentos" 
            component={BuscadorMedicamentos} 
            options={{ title: 'Buscador de Medicamentos' }}
          />
          <Stack.Screen 
            name="Carrito" 
            component={Carrito} 
            options={{ title: 'Carrito de Compras' }}
          />
          <Stack.Screen 
            name="DetalleMedicamento" 
            component={DetalleMedicamento} 
            options={{ title: 'Detalle del Medicamento' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </CarritoProvider>
  );
}
