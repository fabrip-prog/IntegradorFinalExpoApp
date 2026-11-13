import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Callout, Marker } from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { obtenerFiestasDeUsuario } from '../services/fiestaService';
import { obtenerUbicacionActual, pedirPermisoUbicacion } from '../services/locationService';
import { theme } from '../theme';
import { mensajeErrorFiesta } from '../utils/errores';
import { formatearFecha } from '../utils/fechas';
import { REGION_INICIAL, regionDesdeUbicacion, regionQueContiene } from '../utils/mapa';

// Mapa con un marcador por cada fiesta del usuario que tenga ubicación
export default function MapaScreen({ navigation }) {
  const { usuario } = useAuth();
  const mapaRef = useRef(null);

  const [fiestas, setFiestas] = useState([]);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setError('');
    try {
      const todas = await obtenerFiestasDeUsuario(usuario.uid);
      const conUbicacion = todas.filter((f) => f.ubicacion?.latitud != null);
      setFiestas(conUbicacion);

      // Si el usuario da permiso, el mapa se centra en él; si no, en sus fiestas
      let centro = null;
      try {
        if (await pedirPermisoUbicacion()) {
          centro = await obtenerUbicacionActual();
          setMiUbicacion(centro);
        }
      } catch (errorGps) {
        // Sin GPS igual se muestra el mapa con las fiestas
      }

      const region = centro
        ? regionDesdeUbicacion(centro, 0.1)
        : regionQueContiene(conUbicacion.map((f) => f.ubicacion));
      if (region) mapaRef.current?.animateToRegion(region, 500);
    } catch (err) {
      setError(mensajeErrorFiesta(err));
    } finally {
      setCargando(false);
    }
  }, [usuario.uid]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error}</Text>
        <CustomButton titulo="Reintentar" variante="secundario" onPress={cargar} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <MapView
        ref={mapaRef}
        style={styles.flex}
        initialRegion={REGION_INICIAL}
        showsUserLocation={Boolean(miUbicacion)}
      >
        {fiestas.map((fiesta) => (
          <Marker
            key={fiesta.id}
            coordinate={{ latitude: fiesta.ubicacion.latitud, longitude: fiesta.ubicacion.longitud }}
            pinColor={fiesta.color || theme.colors.accent}
          >
            <Callout onPress={() => navigation.navigate('FiestaDetail', { fiestaId: fiesta.id })}>
              <View style={styles.callout}>
                <Text style={styles.calloutNombre}>{fiesta.nombre}</Text>
                <Text style={styles.calloutFecha}>{formatearFecha(fiesta.fecha)}</Text>
                <Text style={styles.calloutLink}>Ver detalle</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {cargando ? (
        <View style={styles.aviso}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : fiestas.length === 0 ? (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            Ninguna de tus fiestas tiene ubicación. Agregala desde Editar.
          </Text>
        </View>
      ) : null}
    </View>
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
  error: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  aviso: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  avisoTexto: {
    color: theme.colors.text,
    textAlign: 'center',
  },
  callout: {
    minWidth: 160,
    padding: 4,
  },
  calloutNombre: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  calloutFecha: {
    color: '#555555',
    marginTop: 2,
  },
  calloutLink: {
    color: '#1A73E8',
    marginTop: 6,
    fontWeight: 'bold',
  },
});
