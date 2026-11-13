import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Countdown from '../components/Countdown';
import CustomButton from '../components/CustomButton';
import FiestaCard from '../components/FiestaCard';
import { useAuth } from '../context/AuthContext';
import { obtenerFiestasDeUsuario } from '../services/fiestaService';
import { theme } from '../theme';
import { mensajeErrorFiesta } from '../utils/errores';
import { formatearFecha } from '../utils/fechas';
import { resumirFiestas } from '../utils/resumenFiestas';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();

  const [fiestas, setFiestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState('');
  const [flyerConError, setFlyerConError] = useState(null);

  const cargar = useCallback(async () => {
    setError('');
    try {
      setFiestas(await obtenerFiestasDeUsuario(usuario.uid));
    } catch (err) {
      setError(mensajeErrorFiesta(err));
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [usuario.uid]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  function irAlDetalle(fiesta) {
    navigation.navigate('FiestaDetail', { fiestaId: fiesta.id });
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error}</Text>
        <CustomButton titulo="Reintentar" variante="secundario" onPress={cargar} />
      </View>
    );
  }

  const { proxima, destacadas, cantidadProximas, cantidadFinalizadas } = resumirFiestas(fiestas);
  const colorProxima = proxima?.color || theme.colors.accent;
  // Si la fiesta tiene flyer y la imagen carga, se muestra de fondo y translúcido
  const mostrarFlyer = Boolean(proxima?.imagenUri) && proxima.imagenUri !== flyerConError;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.contenedor}
      refreshControl={
        <RefreshControl
          refreshing={refrescando}
          onRefresh={() => {
            setRefrescando(true);
            cargar();
          }}
          tintColor={theme.colors.accent}
        />
      }
    >
      <Text style={styles.saludo}>Hola,</Text>
      <Text style={styles.email} numberOfLines={1}>{usuario?.email}</Text>

      <View style={styles.resumen}>
        <View style={styles.dato}>
          <Text style={styles.datoNumero}>{cantidadProximas}</Text>
          <Text style={styles.datoTexto}>Próximas</Text>
        </View>
        <View style={styles.dato}>
          <Text style={[styles.datoNumero, styles.datoApagado]}>{cantidadFinalizadas}</Text>
          <Text style={styles.datoTexto}>Finalizadas</Text>
        </View>
      </View>

      <Text style={styles.seccion}>Próxima fiesta</Text>
      {proxima ? (
        <Pressable
          onPress={() => irAlDetalle(proxima)}
          style={[styles.hero, { borderColor: colorProxima, shadowColor: colorProxima }]}
        >
          {mostrarFlyer ? (
            <ImageBackground
              source={{ uri: proxima.imagenUri }}
              style={StyleSheet.absoluteFill}
              imageStyle={styles.heroFlyer}
              onError={() => setFlyerConError(proxima.imagenUri)}
            />
          ) : null}
          <Text style={[styles.heroNombre, { color: colorProxima }]}>{proxima.nombre}</Text>
          <Text style={styles.heroTematica}>{proxima.tematica}</Text>
          <Text style={styles.heroFecha}>{formatearFecha(proxima.fecha)}</Text>
          <Countdown fecha={proxima.fecha} color={colorProxima} />
          <Text style={styles.heroLink}>Ver detalle →</Text>
        </Pressable>
      ) : (
        <View style={styles.vacio}>
          <Text style={styles.vacioTexto}>No tenés fiestas próximas.</Text>
          <CustomButton
            titulo="Crear mi primera fiesta"
            onPress={() => navigation.navigate('FiestaForm')}
          />
        </View>
      )}

      {destacadas.length > 0 ? (
        <>
          <Text style={styles.seccion}>Destacadas</Text>
          <FlatList
            horizontal
            data={destacadas}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.destacada}>
                <FiestaCard fiesta={item} onPress={() => irAlDetalle(item)} />
              </View>
            )}
          />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centrado: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contenedor: {
    padding: 20,
    paddingBottom: 40,
  },
  saludo: {
    color: theme.colors.secondary,
    fontSize: 16,
  },
  email: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  resumen: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  dato: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  datoNumero: {
    color: theme.colors.accent,
    fontSize: 28,
    fontWeight: '900',
  },
  datoApagado: {
    color: theme.colors.secondary,
  },
  datoTexto: {
    color: theme.colors.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  seccion: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 10,
  },
  hero: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  heroFlyer: {
    borderRadius: 15,
    opacity: 0.3,
  },
  heroNombre: {
    fontSize: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  heroTematica: {
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  heroFecha: {
    color: theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  heroLink: {
    color: theme.colors.secondary,
    textAlign: 'right',
    marginTop: 12,
  },
  vacio: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
  },
  vacioTexto: {
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  destacada: {
    width: 280,
    marginRight: 12,
  },
  error: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
