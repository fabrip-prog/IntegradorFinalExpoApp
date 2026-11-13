import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import FiestaCard from '../components/FiestaCard';
import { useAuth } from '../context/AuthContext';
import { obtenerFiestasDeUsuario } from '../services/fiestaService';
import { theme } from '../theme';

export default function FiestaListScreen({ navigation }) {
  const { usuario } = useAuth();
  const [fiestas, setFiestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  const cargarFiestas = useCallback(
    async (mostrarSpinner = true) => {
      if (!usuario?.uid) {
        setCargando(false);
        return;
      }

      if (mostrarSpinner) {
        setCargando(true);
      }
      setError(null);

      try {
        const lista = await obtenerFiestasDeUsuario(usuario.uid);
        setFiestas(lista);
      } catch (err) {
        setError('No se pudieron cargar tus fiestas. Revisá tu conexión.');
      } finally {
        setCargando(false);
        setRefrescando(false);
      }
    },
    [usuario?.uid]
  );

  // Recarga al entrar o volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarFiestas(fiestas.length === 0);
    }, [cargarFiestas, fiestas.length])
  );

  const manejarRefresco = () => {
    setRefrescando(true);
    cargarFiestas(false);
  };

  // Estado: Cargando
  if (cargando && !refrescando) {
    return (
      <View style={styles.pantallaCentrada}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.textoCargando}>Cargando fiestas...</Text>
      </View>
    );
  }

  // Estado: Error
  if (error && !refrescando && fiestas.length === 0) {
    return (
      <View style={styles.pantallaCentrada}>
        <Text style={styles.textoError}>{error}</Text>
        <CustomButton
          titulo="Reintentar"
          onPress={() => cargarFiestas(true)}
          style={styles.botonReintentar}
        />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.barraAcciones}>
        <CustomButton
          titulo="+ Nueva fiesta"
          onPress={() => navigation.navigate('FiestaForm')}
        />
      </View>

      <FlatList
        data={fiestas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FiestaCard
            fiesta={item}
            onPress={() =>
              navigation.navigate('FiestaDetail', { fiestaId: item.id })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={manejarRefresco}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        contentContainerStyle={
          fiestas.length === 0 ? styles.contenedorVacio : styles.lista
        }
        ListEmptyComponent={
          <View style={styles.cajaVacia}>
            <Text style={styles.iconoVacio}>🎉</Text>
            <Text style={styles.tituloVacio}>No tenés fiestas creadas todavía</Text>
            <Text style={styles.subtituloVacio}>
              Tocá el botón superior "+ Nueva fiesta" para crear y gestionar tu primer evento.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pantallaCentrada: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  textoCargando: {
    color: theme.colors.secondary,
    fontSize: 16,
    marginTop: 12,
  },
  textoError: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  botonReintentar: {
    minWidth: 160,
  },
  barraAcciones: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  lista: {
    padding: 16,
    paddingBottom: 32,
  },
  contenedorVacio: {
    flexGrow: 1,
    padding: 16,
  },
  cajaVacia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconoVacio: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloVacio: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtituloVacio: {
    color: theme.colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
