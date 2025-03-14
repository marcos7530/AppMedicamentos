import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@rneui/themed';
import BuscadorMedicamentos from './src/screens/BuscadorMedicamentos';
import DetalleMedicamento from './src/screens/DetalleMedicamento';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Buscador" 
            component={BuscadorMedicamentos} 
            options={{ title: 'Buscador de Medicamentos' }}
          />
          <Stack.Screen 
            name="Detalle" 
            component={DetalleMedicamento} 
            options={{ title: 'Detalle del Medicamento' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
