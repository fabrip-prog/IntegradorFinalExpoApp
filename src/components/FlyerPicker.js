import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import { elegirDeGaleria, sacarFoto } from '../services/imageService';
import { theme } from '../theme';

export default function FlyerPicker({ valor, onCambiar, color = theme.colors.accent }) {
  const [error, setError] = useState('');

  async function elegir(funcion) {
    setError('');
    try {
      const uri = await funcion();
      if (uri) onCambiar(uri);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.contenedor}>
      {valor ? (
        <Image source={{ uri: valor }} style={styles.vistaPrevia} />
      ) : (
        <View style={[styles.vistaPrevia, styles.vacio, { borderColor: color }]}>
          <Text style={styles.vacioTexto}>Sin flyer</Text>
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <CustomButton
        titulo="Elegir de la galería"
        variante="secundario"
        onPress={() => elegir(elegirDeGaleria)}
      />
      <CustomButton titulo="Sacar foto" variante="secundario" onPress={() => elegir(sacarFoto)} />
      {valor ? (
        <CustomButton titulo="Quitar flyer" variante="peligro" onPress={() => onCambiar(null)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 8,
  },
  vistaPrevia: {
    width: 160,
    height: 200,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 8,
  },
  vacio: {
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacioTexto: {
    color: theme.colors.secondary,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
  },
});
