import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from '@rneui/themed';
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
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        icon={
          <Icon
            name="search"
            type="font-awesome"
            color="white"
            size={24}
            style={styles.buttonIcon}
          />
        }
        iconPosition="left"
      />
      <Button
        title="Ver Carrito"
        onPress={() => navigation.navigate('Carrito')}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        icon={
          <Icon
            name="shopping-cart"
            type="font-awesome"
            color="white"
            size={24}
            style={styles.buttonIcon}
          />
        }
        iconPosition="left"
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
    marginVertical: 15,
    width: '100%',
  },
  button: {
    height: 60,
    borderRadius: 10,
    backgroundColor: '#2089dc',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
}); 