import { StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import FormInput from './FormInput';
import { theme } from '../theme';

export default function PreventaItemForm({
  item,
  index,
  onChange,
  onQuitar,
  errores = {},
}) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaEncabezado}>
        <Text style={styles.titulo}>Preventa #{index + 1}</Text>
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
        placeholder="Ej: Preventa 1 / Early Bird"
        error={errores.nombre}
      />

      <FormInput
        etiqueta="Precio ($)"
        value={item.precio !== undefined && item.precio !== null ? String(item.precio) : ''}
        onChangeText={(val) => onChange('precio', val)}
        placeholder="Ej: 15000"
        keyboardType="numeric"
        error={errores.precio}
      />

      <View style={styles.filaFechas}>
        <View style={styles.columnaFecha}>
          <FormInput
            etiqueta="Inicio"
            value={item.inicio}
            onChangeText={(val) => onChange('inicio', val)}
            placeholder="DD/MM HH:MM"
            autoCapitalize="none"
            error={errores.inicio}
          />
        </View>
        <View style={styles.espaciador} />
        <View style={styles.columnaFecha}>
          <FormInput
            etiqueta="Fin"
            value={item.fin}
            onChangeText={(val) => onChange('fin', val)}
            placeholder="DD/MM HH:MM"
            autoCapitalize="none"
            error={errores.fin}
          />
        </View>
      </View>
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
  filaFechas: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  columnaFecha: {
    flex: 1,
  },
  espaciador: {
    width: 12,
  },
});
