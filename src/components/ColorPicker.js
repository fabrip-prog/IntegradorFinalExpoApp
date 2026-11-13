import { Pressable, StyleSheet, View } from 'react-native';

// Colores neón de FiestaWeb
export const COLORES_FIESTA = ['#39FF14', '#FF00FF', '#00FFFF', '#FFD700', '#FF4500', '#8A2BE2'];

export default function ColorPicker({ valor, onCambiar }) {
  return (
    <View style={styles.fila}>
      {COLORES_FIESTA.map((color) => (
        <Pressable
          key={color}
          onPress={() => onCambiar(color)}
          accessibilityLabel={`Color ${color}`}
          style={[
            styles.circulo,
            { backgroundColor: color },
            valor === color && styles.seleccionado,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  circulo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  seleccionado: {
    borderColor: '#FFFFFF',
  },
});
