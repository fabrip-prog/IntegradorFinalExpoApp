import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { theme } from '../theme';

export default function AppNavigator() {
  const { usuario, cargando } = useAuth();

  // Mientras Firebase confirma si hay sesión, no mostramos ninguna pantalla
  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  // Con usuario se muestran las pantallas privadas; sin usuario, solo login y registro
  return (
    <NavigationContainer>
      {usuario ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
