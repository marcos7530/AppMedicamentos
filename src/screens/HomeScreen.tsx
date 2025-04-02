import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  BuscadorMedicamentos: undefined;
  Carrito: undefined;
  DetalleMedicamento: { medicamento: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="Buscar Medicamentos"
        onPress={() => navigation.navigate('BuscadorMedicamentos')}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Ver Carrito"
        onPress={() => navigation.navigate('Carrito')}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginVertical: 10,
  },
}); 