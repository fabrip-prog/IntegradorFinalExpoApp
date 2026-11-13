import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

// Placeholder: se implementa en la etapa 4
export default function FiestaFormScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Nueva Fiesta</Text>
      <Text style={styles.subtitulo}>Formulario de creación (Etapa 4)</Text>
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
