import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const VARIANTES = {
  primario: { fondo: theme.colors.accent, texto: theme.colors.background, borde: theme.colors.accent },
  secundario: { fondo: 'transparent', texto: theme.colors.text, borde: theme.colors.secondary },
  peligro: { fondo: 'transparent', texto: theme.colors.error, borde: theme.colors.error },
};

export default function CustomButton({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  style,
}) {
  const colores = VARIANTES[variante] || VARIANTES.primario;
  const inactivo = deshabilitado || cargando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: colores.fondo, borderColor: colores.borde },
        (pressed || inactivo) && styles.atenuado,
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <Text style={[styles.texto, { color: colores.texto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  atenuado: {
    opacity: 0.6,
  },
});
