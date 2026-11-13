import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { diasQueFaltan, formatearFecha } from '../utils/fechas';

export default function FiestaCard({ fiesta, onPress }) {
  if (!fiesta) return null;

  const colorFiesta = fiesta.color || theme.colors.accent;
  const dias = diasQueFaltan(fiesta.fecha);

  let textoDias = '';
  let esFinalizada = false;

  if (dias < 0) {
    textoDias = 'Finalizada';
    esFinalizada = true;
  } else if (dias === 0) {
    textoDias = 'Hoy';
  } else if (dias === 1) {
    textoDias = 'Falta 1 día';
  } else {
    textoDias = `Faltan ${dias} días`;
  }

  const fechaTexto = formatearFecha(fiesta.fecha);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tarjeta,
        pressed && styles.presionado,
      ]}
    >
      <View style={[styles.franjaColor, { backgroundColor: colorFiesta }]} />
      {fiesta.imagenUri ? (
        <Image source={{ uri: fiesta.imagenUri }} style={styles.miniatura} />
      ) : null}
      <View style={styles.contenido}>
        <View style={styles.filaSuperior}>
          <Text style={styles.nombre} numberOfLines={1}>
            {fiesta.nombre}
          </Text>
          {fiesta.destacada && (
            <View style={styles.badgeDestacada}>
              <Text style={styles.textoDestacada}>Destacada</Text>
            </View>
          )}
        </View>

        {Boolean(fiesta.tematica) && (
          <Text style={styles.tematica} numberOfLines={1}>
            {fiesta.tematica}
          </Text>
        )}

        <View style={styles.filaInferior}>
          <Text style={styles.fecha}>{fechaTexto}</Text>
          <View
            style={[
              styles.badgeEstado,
              esFinalizada ? styles.badgeFinalizada : styles.badgePendiente,
            ]}
          >
            <Text
              style={[
                styles.textoEstado,
                esFinalizada ? styles.textoFinalizada : styles.textoPendiente,
              ]}
            >
              {textoDias}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262630',
  },
  presionado: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  franjaColor: {
    width: 6,
  },
  miniatura: {
    width: 72,
    alignSelf: 'stretch',
    backgroundColor: '#262630',
  },
  contenido: {
    flex: 1,
    padding: 16,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nombre: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badgeDestacada: {
    backgroundColor: '#39FF1420',
    borderColor: theme.colors.accent,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  textoDestacada: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
  },
  tematica: {
    color: theme.colors.secondary,
    fontSize: 14,
    marginBottom: 12,
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fecha: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  badgeEstado: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePendiente: {
    backgroundColor: '#1E293B',
  },
  badgeFinalizada: {
    backgroundColor: '#2A181A',
  },
  textoEstado: {
    fontSize: 12,
    fontWeight: '600',
  },
  textoPendiente: {
    color: theme.colors.accent,
  },
  textoFinalizada: {
    color: theme.colors.error,
  },
});
