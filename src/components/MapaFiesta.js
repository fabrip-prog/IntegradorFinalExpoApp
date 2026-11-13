import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from './CustomButton';
import { theme } from '../theme';
import { linkComoLlegar, regionDesdeUbicacion } from '../utils/mapa';

// Mapa chico, de solo lectura, para el detalle de la fiesta
export default function MapaFiesta({ ubicacion, color = theme.colors.accent, nombre }) {
  if (!ubicacion) {
    return <Text style={styles.vacio}>Sin ubicación cargada.</Text>;
  }

  function abrirComoLlegar() {
    Linking.openURL(linkComoLlegar(ubicacion)).catch(() => {
      Alert.alert('No se pudo abrir el mapa', 'Probá de nuevo más tarde.');
    });
  }

  return (
    <View>
      <View style={styles.marco} pointerEvents="none">
        <MapView
          style={styles.mapa}
          initialRegion={regionDesdeUbicacion(ubicacion, 0.01)}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{ latitude: ubicacion.latitud, longitude: ubicacion.longitud }}
            pinColor={color}
            title={nombre}
          />
        </MapView>
      </View>
      {ubicacion.direccion ? <Text style={styles.direccion}>📍 {ubicacion.direccion}</Text> : null}
      <CustomButton titulo="Cómo llegar" variante="secundario" onPress={abrirComoLlegar} />
    </View>
  );
}

const styles = StyleSheet.create({
  marco: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapa: {
    height: 180,
  },
  direccion: {
    color: theme.colors.text,
    fontSize: 14,
    marginTop: 8,
  },
  vacio: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
});
