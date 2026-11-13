import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { cerrarSesion } from '../services/authService';
import { obtenerFiestasDeUsuario } from '../services/fiestaService';
import { theme } from '../theme';

function formatearAlta(creationTime) {
  if (!creationTime) return '';
  const fecha = new Date(creationTime);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

export default function ProfileScreen() {
  const { usuario } = useAuth();
  const [cantidad, setCantidad] = useState(null);
  const [cerrando, setCerrando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      obtenerFiestasDeUsuario(usuario.uid)
        .then((fiestas) => setCantidad(fiestas.length))
        .catch(() => setCantidad(null));
    }, [usuario.uid])
  );

  function confirmarCerrarSesion() {
    Alert.alert('Cerrar sesión', '¿Querés salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: salir },
    ]);
  }

  async function salir() {
    setCerrando(true);
    try {
      await cerrarSesion();
    } catch {
      setCerrando(false);
      Alert.alert('No se pudo cerrar sesión', 'Probá de nuevo.');
    }
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>{usuario?.email?.[0]?.toUpperCase()}</Text>
      </View>
      <Text style={styles.email}>{usuario?.email}</Text>

      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Productor desde</Text>
          <Text style={styles.valor}>{formatearAlta(usuario?.metadata?.creationTime)}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Fiestas cargadas</Text>
          {cantidad === null ? (
            <ActivityIndicator size="small" color={theme.colors.accent} />
          ) : (
            <Text style={styles.valor}>{cantidad}</Text>
          )}
        </View>
      </View>

      <CustomButton
        titulo="Cerrar sesión"
        variante="peligro"
        onPress={confirmarCerrarSesion}
        cargando={cerrando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
    paddingTop: 40,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  avatarLetra: {
    color: theme.colors.accent,
    fontSize: 36,
    fontWeight: '900',
  },
  email: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  tarjeta: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#262630',
  },
  etiqueta: {
    color: theme.colors.secondary,
    fontSize: 15,
  },
  valor: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
