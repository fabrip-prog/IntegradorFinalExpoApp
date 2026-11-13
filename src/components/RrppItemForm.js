import { StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import FormInput from './FormInput';
import { theme } from '../theme';

export default function RrppItemForm({
  item,
  index,
  onChange,
  onQuitar,
  errores = {},
}) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaEncabezado}>
        <Text style={styles.titulo}>Vendedor #{index + 1}</Text>
        <CustomButton
          titulo="Quitar"
          variante="peligro"
          onPress={onQuitar}
          style={styles.botonQuitar}
        />
      </View>

      <FormInput
        etiqueta="Nombre"
        value={item.nombre}
        onChangeText={(val) => onChange('nombre', val)}
        placeholder="Ej: Lucas Martínez"
        error={errores.nombre}
      />

      <FormInput
        etiqueta="Zona"
        value={item.zona}
        onChangeText={(val) => onChange('zona', val)}
        placeholder="Ej: Palermo / Zona Norte"
        error={errores.zona}
      />

      <FormInput
        etiqueta="WhatsApp (solo dígitos con cód. país)"
        value={item.telefono}
        onChangeText={(val) => onChange('telefono', val.replace(/\D/g, ''))}
        placeholder="Ej: 5493329506445"
        keyboardType="phone-pad"
        error={errores.telefono}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#16161D',
    borderColor: '#2A2A35',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  filaEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titulo: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonQuitar: {
    minHeight: 36,
    paddingHorizontal: 12,
    marginVertical: 0,
  },
});
