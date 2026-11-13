import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import { DIAS_MAXIMOS_PRONOSTICO, obtenerPronostico } from '../services/climaService';
import { theme } from '../theme';
import { diasQueFaltan, formatearFecha } from '../utils/fechas';

// Muestra el pronóstico para la noche de la fiesta, con todos sus estados
export default function ClimaCard({ ubicacion, fecha }) {
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const dias = diasQueFaltan(fecha);
  const latitud = ubicacion?.latitud;
  const longitud = ubicacion?.longitud;
  const tiempoFecha = fecha instanceof Date ? fecha.getTime() : null;
  const puedeConsultar =
    latitud != null &&
    tiempoFecha != null &&
    dias >= 0 &&
    dias <= DIAS_MAXIMOS_PRONOSTICO;

  const consultar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const resultado = await obtenerPronostico(latitud, longitud, new Date(tiempoFecha));
      setClima(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [latitud, longitud, tiempoFecha]);

  // Solo se consulta cuando cambian el lugar o la fecha, no en cada render
  useEffect(() => {
    if (puedeConsultar) consultar();
  }, [puedeConsultar, consultar]);

  // Fiesta pasada: no se muestra nada
  if (dias < 0) return null;

  if (latitud == null) {
    return <Text style={styles.aviso}>Cargá la ubicación para ver el clima.</Text>;
  }

  if (dias > DIAS_MAXIMOS_PRONOSTICO) {
    const desde = new Date(tiempoFecha);
    desde.setDate(desde.getDate() - DIAS_MAXIMOS_PRONOSTICO);
    return (
      <Text style={styles.aviso}>
        El pronóstico estará disponible desde el{' '}
        {formatearFecha(desde).split(' ').slice(0, 2).join(' ')}.
      </Text>
    );
  }

  if (cargando) {
    return (
      <View style={[styles.tarjeta, styles.fila]}>
        <ActivityIndicator color={theme.colors.accent} />
        <Text style={styles.textoCargando}>Consultando el clima...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.tarjeta}>
        <Text style={styles.error}>{error}</Text>
        <CustomButton titulo="Reintentar" variante="secundario" onPress={consultar} />
      </View>
    );
  }

  if (!clima) return null;

  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Text style={styles.icono}>{clima.icono}</Text>
        <View style={styles.datos}>
          <Text style={styles.descripcion}>{clima.descripcion}</Text>
          <Text style={styles.temperaturas}>
            Máx {clima.maxima}°C · Mín {clima.minima}°C
          </Text>
          <Text style={styles.lluvia}>Probabilidad de lluvia: {clima.probLluvia}%</Text>
        </View>
      </View>
      {clima.probLluvia > 60 ? (
        <Text style={styles.paraguas}>Llevá paraguas</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262630',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icono: {
    fontSize: 42,
    marginRight: 16,
  },
  datos: {
    flex: 1,
  },
  descripcion: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  temperaturas: {
    color: theme.colors.text,
    fontSize: 15,
    marginTop: 4,
  },
  lluvia: {
    color: theme.colors.secondary,
    fontSize: 14,
    marginTop: 2,
  },
  paraguas: {
    color: '#00FFFF',
    fontWeight: 'bold',
    marginTop: 12,
  },
  textoCargando: {
    color: theme.colors.secondary,
    marginLeft: 12,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 8,
  },
  aviso: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
});