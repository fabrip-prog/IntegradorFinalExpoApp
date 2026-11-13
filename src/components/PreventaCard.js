import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { preventaVencida } from '../utils/fechas';
import { formatearPrecio } from '../utils/moneda';

export default function PreventaCard({ preventa, fechaFiesta }) {
  if (!preventa) return null;

  const vencida = preventaVencida(preventa.fin, fechaFiesta);
  const precioTexto = formatearPrecio(preventa.precio);

  let fechasTexto = '';
  if (preventa.inicio && preventa.fin) {
    fechasTexto = `${preventa.inicio} a ${preventa.fin}`;
  } else if (preventa.fin) {
    fechasTexto = `Hasta ${preventa.fin}`;
  } else if (preventa.inicio) {
    fechasTexto = `Desde ${preventa.inicio}`;
  }

  return (
    <View style={[styles.tarjeta, vencida && styles.tarjetaVencida]}>
      <View style={styles.filaSuperior}>
        <Text style={styles.nombre} numberOfLines={1}>
          {preventa.nombre}
        </Text>
        <Text style={styles.precio}>{precioTexto}</Text>
      </View>

      <View style={styles.filaInferior}>
        {Boolean(fechasTexto) && (
          <Text style={styles.fechas}>📅 {fechasTexto}</Text>
        )}
        {vencida ? (
          <View style={styles.badgeVencida}>
            <Text style={styles.textoVencida}>Agotada/Vencida</Text>
          </View>
        ) : (
          <View style={styles.badgeDisponible}>
            <Text style={styles.textoDisponible}>Disponible</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262630',
    padding: 16,
    marginBottom: 10,
  },
  tarjetaVencida: {
    opacity: 0.75,
    borderColor: '#3D2024',
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nombre: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  precio: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fechas: {
    color: theme.colors.secondary,
    fontSize: 13,
  },
  badgeVencida: {
    backgroundColor: '#35181C',
    borderColor: theme.colors.error,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  textoVencida: {
    color: theme.colors.error,
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeDisponible: {
    backgroundColor: '#162816',
    borderColor: '#22C55E',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  textoDisponible: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
