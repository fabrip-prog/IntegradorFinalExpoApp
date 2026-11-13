import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { cerrarSesion } from '../services/authService';
import { theme } from '../theme';

// Placeholder de perfil con botón para cerrar sesión
export default function ProfileScreen() {
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
      <Text style={styles.titulo}>Mi Perfil</Text>
      <Text style={styles.etiqueta}>Usuario conectado:</Text>
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
  titulo: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  etiqueta: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
  email: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 32,
    marginTop: 4,
  },
  boton: {
    marginTop: 8,
  },
});
