import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { cerrarSesion } from '../services/authService';
import { theme } from '../theme';

// Versión básica: se completa en la etapa 8
export default function HomeScreen() {
  const { usuario } = useAuth();
  const [cargando, setCargando] = useState(false);

  async function manejarCerrarSesion() {
    setCargando(true);
    try {
      await cerrarSesion();
    } catch (error) {
      setCargando(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.saludo}>Hola,</Text>
      <Text style={styles.email}>{usuario?.email}</Text>
      <CustomButton
        titulo="Cerrar sesión"
        variante="peligro"
        onPress={manejarCerrarSesion}
        cargando={cargando}
        style={styles.boton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  saludo: {
    color: theme.colors.secondary,
    fontSize: 18,
  },
  email: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  boton: {
    marginTop: 8,
  },
});
