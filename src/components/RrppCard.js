import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function RrppCard({ rrpp, nombreFiesta }) {
  if (!rrpp) return null;

  function abrirWhatsApp() {
    const telefonoLimpio = String(rrpp.telefono || '').replace(/\D/g, '');
    if (telefonoLimpio.length < 10 || telefonoLimpio.length > 15) {
      Alert.alert('Teléfono inválido', 'Este vendedor no tiene un número de WhatsApp válido.');
      return;
    }
    const textoMensaje = `Hola ${rrpp.nombre || ''}! Quiero entradas para ${nombreFiesta || 'la fiesta'}`;
    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(textoMensaje)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('No se pudo abrir WhatsApp', 'Revisá que haya una aplicación disponible para abrir el enlace.');
    });
  }

  return (
    <View style={styles.tarjeta}>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {rrpp.nombre}
        </Text>
        {Boolean(rrpp.zona) && (
          <Text style={styles.zona} numberOfLines={1}>
            📍 {rrpp.zona}
          </Text>
        )}
      </View>

      <Pressable
        onPress={abrirWhatsApp}
        style={({ pressed }) => [
          styles.botonWhatsapp,
          pressed && styles.botonPresionado,
        ]}
      >
        <Text style={styles.textoBoton}>WhatsApp</Text>
      </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  nombre: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zona: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
  botonWhatsapp: {
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPresionado: {
    opacity: 0.8,
  },
  textoBoton: {
    color: '#0B0B0F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
