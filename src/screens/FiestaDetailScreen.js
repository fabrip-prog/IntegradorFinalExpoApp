import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Countdown from '../components/Countdown';
import CustomButton from '../components/CustomButton';
import MapaFiesta from '../components/MapaFiesta';
import PreventaCard from '../components/PreventaCard';
import RrppCard from '../components/RrppCard';
import { eliminarFiesta, obtenerFiesta } from '../services/fiestaService';
import { theme } from '../theme';
import { mensajeErrorFiesta } from '../utils/errores';
import { formatearFecha } from '../utils/fechas';

export default function FiestaDetailScreen({ navigation, route }) {
  const fiestaId = route?.params?.fiestaId;

  const [fiesta, setFiesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);

  const cargar = useCallback(async () => {
    setError('');
    try {
      const datos = await obtenerFiesta(fiestaId);
      if (!datos) {
        setError('La fiesta no existe o fue eliminada.');
      }
      setFiesta(datos);
    } catch (err) {
      setError(mensajeErrorFiesta(err));
    } finally {
      setCargando(false);
    }
  }, [fiestaId]);

  // Recarga cada vez que se vuelve a esta pantalla (por ejemplo, después de editar)
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  function confirmarEliminar() {
    Alert.alert(
      'Eliminar fiesta',
      `¿Seguro que querés eliminar "${fiesta.nombre}"? No se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: eliminar },
      ]
    );
  }

  async function eliminar() {
    setEliminando(true);
    try {
      await eliminarFiesta(fiestaId);
      navigation.goBack();
    } catch (err) {
      setEliminando(false);
      Alert.alert('No se pudo eliminar', mensajeErrorFiesta(err));
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (error || !fiesta) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error}</Text>
        <CustomButton titulo="Volver" variante="secundario" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const color = fiesta.color || theme.colors.accent;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.contenedor}>
      <View style={[styles.encabezado, { borderColor: color, shadowColor: color }]}>
        {fiesta.destacada ? <Text style={[styles.destacada, { color }]}>★ Destacada</Text> : null}
        <Text style={[styles.nombre, { color }]}>{fiesta.nombre}</Text>
        <Text style={styles.tematica}>{fiesta.tematica}</Text>
        <Text style={styles.fecha}>{formatearFecha(fiesta.fecha)}</Text>
      </View>

      <Text style={styles.seccion}>Cuenta regresiva</Text>
      <Countdown fecha={fiesta.fecha} color={color} />

      {fiesta.descripcion ? (
        <>
          <Text style={styles.seccion}>Información de la fiesta</Text>
          <Text style={styles.descripcion}>{fiesta.descripcion}</Text>
        </>
      ) : null}

      <Text style={styles.seccion}>Ubicación</Text>
      <MapaFiesta ubicacion={fiesta.ubicacion} color={color} nombre={fiesta.nombre} />

      <Text style={styles.seccion}>Tickets y preventas</Text>
      {fiesta.preventas?.length ? (
        fiesta.preventas.map((preventa, index) => (
          <PreventaCard
            key={`preventa-${index}`}
            preventa={preventa}
            fechaFiesta={fiesta.fecha}
          />
        ))
      ) : (
        <Text style={styles.textoVacio}>Todavía no hay preventas cargadas.</Text>
      )}

      <Text style={styles.seccion}>Vendedores oficiales</Text>
      {fiesta.rrpp?.length ? (
        fiesta.rrpp.map((vendedor, index) => (
          <RrppCard
            key={`rrpp-${index}`}
            rrpp={vendedor}
            nombreFiesta={fiesta.nombre}
          />
        ))
      ) : (
        <Text style={styles.textoVacio}>Todavía no hay vendedores RRPP cargados.</Text>
      )}

      <View style={styles.acciones}>
        <CustomButton
          titulo="Editar"
          variante="secundario"
          onPress={() => navigation.navigate('FiestaForm', { fiestaId })}
        />
        <CustomButton
          titulo="Eliminar"
          variante="peligro"
          onPress={confirmarEliminar}
          cargando={eliminando}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centrado: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contenedor: {
    padding: 20,
    paddingBottom: 40,
  },
  encabezado: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  destacada: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  nombre: {
    fontSize: 34,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tematica: {
    color: theme.colors.secondary,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  fecha: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  seccion: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 10,
  },
  descripcion: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  textoVacio: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
  acciones: {
    marginTop: 32,
  },
  error: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
