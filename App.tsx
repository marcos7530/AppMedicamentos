import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Icon } from '@rneui/themed';
import BuscadorMedicamentos from './src/screens/BuscadorMedicamentos';
import DetalleMedicamento from './src/screens/DetalleMedicamento';
import Carrito from './src/screens/Carrito';
import { CarritoProvider } from './src/context/CarritoContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CarritoProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Buscador"
            component={BuscadorMedicamentos}
            options={({ navigation }) => ({
              title: 'Buscador de Medicamentos',
              headerRight: () => (
                <Button
                  type="clear"
                  onPress={() => navigation.navigate('Carrito')}
                  icon={<Icon name="shopping-cart" type="font-awesome" size={24} color="#000" />}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Detalle"
            component={DetalleMedicamento}
            options={{ title: 'Detalle del Medicamento' }}
          />
          <Stack.Screen
            name="Carrito"
            component={Carrito}
            options={{ title: 'Carrito de Compras' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CarritoProvider>
  );
}
