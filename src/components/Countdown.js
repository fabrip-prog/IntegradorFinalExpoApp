import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { tiempoRestante } from '../utils/fechas';

export default function Countdown({ fecha, color = theme.colors.accent }) {
  const [restante, setRestante] = useState(() => tiempoRestante(fecha));

  useEffect(() => {
    setRestante(tiempoRestante(fecha));
    const intervalo = setInterval(() => setRestante(tiempoRestante(fecha)), 1000);
    // Se limpia al salir de la pantalla para no dejar el timer corriendo
    return () => clearInterval(intervalo);
  }, [fecha]);

  if (!restante) {
    return <Text style={styles.terminada}>La fiesta ya fue</Text>;
  }

  const bloques = [
    { valor: restante.dias, etiqueta: 'Días' },
    { valor: restante.horas, etiqueta: 'Horas' },
    { valor: restante.minutos, etiqueta: 'Min' },
    { valor: restante.segundos, etiqueta: 'Seg' },
  ];

  return (
    <View style={styles.fila}>
      {bloques.map((bloque) => (
        <View key={bloque.etiqueta} style={[styles.bloque, { borderColor: color }]}>
          <Text style={[styles.numero, { color }]}>{String(bloque.valor).padStart(2, '0')}</Text>
          <Text style={styles.etiqueta}>{bloque.etiqueta}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  bloque: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
  },
  numero: {
    fontSize: 26,
    fontWeight: '900',
  },
  etiqueta: {
    color: theme.colors.secondary,
    fontSize: 11,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  terminada: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
