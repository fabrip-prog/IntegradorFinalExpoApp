import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from './CustomButton';
import {
  obtenerDireccion,
  obtenerUbicacionActual,
  pedirPermisoUbicacion,
} from '../services/locationService';
import { theme } from '../theme';
import { REGION_INICIAL, regionDesdeUbicacion } from '../utils/mapa';

// Permite elegir dónde es la fiesta: tocando el mapa o con el GPS
export default function UbicacionPicker({ valor, onCambiar, color = theme.colors.accent }) {
  const mapaRef = useRef(null);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function elegirPunto(latitud, longitud) {
    // Primero se marca el punto y después se completa la dirección
    onCambiar({ latitud, longitud, direccion: '' });
    const direccion = await obtenerDireccion(latitud, longitud);
    onCambiar({ latitud, longitud, direccion });
  }

  function manejarToqueMapa(evento) {
    const { latitude, longitude } = evento.nativeEvent.coordinate;
    setMensaje('');
    elegirPunto(latitude, longitude);
  }

  async function usarMiUbicacion() {
    setMensaje('');
    setBuscando(true);
    try {
      const permitido = await pedirPermisoUbicacion();
      if (!permitido) {
        setMensaje('No diste permiso de ubicación. Igual podés tocar el mapa para elegir el lugar.');
        return;
      }
      const { latitud, longitud } = await obtenerUbicacionActual();
      mapaRef.current?.animateToRegion(regionDesdeUbicacion({ latitud, longitud }), 500);
      await elegirPunto(latitud, longitud);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.ayuda}>Tocá el mapa para marcar dónde es la fiesta.</Text>
      <MapView
        ref={mapaRef}
        style={styles.mapa}
        initialRegion={valor ? regionDesdeUbicacion(valor) : REGION_INICIAL}
        onPress={manejarToqueMapa}
      >
        {valor ? (
          <Marker
            coordinate={{ latitude: valor.latitud, longitude: valor.longitud }}
            pinColor={color}
          />
        ) : null}
      </MapView>

      {valor ? (
        <Text style={styles.direccion}>
          📍 {valor.direccion || 'Ubicación marcada (sin dirección disponible)'}
        </Text>
      ) : (
        <Text style={styles.sinUbicacion}>Todavía no marcaste una ubicación.</Text>
      )}

      {mensaje ? <Text style={styles.error}>{mensaje}</Text> : null}

      {buscando ? (
        <ActivityIndicator color={theme.colors.accent} style={styles.cargando} />
      ) : (
        <CustomButton titulo="Usar mi ubicación" variante="secundario" onPress={usarMiUbicacion} />
      )}
      {valor ? (
        <CustomButton titulo="Quitar ubicación" variante="peligro" onPress={() => onCambiar(null)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 8,
  },
  ayuda: {
    color: theme.colors.secondary,
    fontSize: 13,
    marginBottom: 8,
  },
  mapa: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },
  direccion: {
    color: theme.colors.text,
    fontSize: 14,
    marginTop: 8,
  },
  sinUbicacion: {
    color: theme.colors.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 6,
  },
  cargando: {
    marginVertical: 14,
  },
});
