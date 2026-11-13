import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

// Placeholder: se implementa en la etapa 4
export default function FiestaDetailScreen({ route }) {
  const { fiestaId } = route?.params || {};

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Detalle de la Fiesta</Text>
      {Boolean(fiestaId) && (
        <Text style={styles.subtitulo}>ID: {fiestaId}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: theme.colors.secondary,
    fontSize: 16,
    marginTop: 8,
  },
});
