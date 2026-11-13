import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import ColorPicker, { COLORES_FIESTA } from '../components/ColorPicker';
import CustomButton from '../components/CustomButton';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { actualizarFiesta, crearFiesta, obtenerFiesta } from '../services/fiestaService';
import { theme } from '../theme';
import { mensajeErrorFiesta } from '../utils/errores';
import { fechaATexto, parsearFechaTexto } from '../utils/fechas';

// Un solo formulario para crear (sin fiestaId) y editar (con fiestaId)
export default function FiestaFormScreen({ navigation, route }) {
  const fiestaId = route?.params?.fiestaId;
  const esEdicion = Boolean(fiestaId);
  const { usuario } = useAuth();

  const [nombre, setNombre] = useState('');
  const [tematica, setTematica] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaTexto, setFechaTexto] = useState('');
  const [color, setColor] = useState(COLORES_FIESTA[0]);
  const [destacada, setDestacada] = useState(false);

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargandoFiesta, setCargandoFiesta] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: esEdicion ? 'Editar fiesta' : 'Nueva fiesta' });
  }, [navigation, esEdicion]);

  useEffect(() => {
    if (!esEdicion) return;

    async function cargar() {
      try {
        const fiesta = await obtenerFiesta(fiestaId);
        if (!fiesta) {
          setErrorGeneral('La fiesta no existe.');
          return;
        }
        setNombre(fiesta.nombre || '');
        setTematica(fiesta.tematica || '');
        setDescripcion(fiesta.descripcion || '');
        setFechaTexto(fechaATexto(fiesta.fecha));
        setColor(fiesta.color || COLORES_FIESTA[0]);
        setDestacada(Boolean(fiesta.destacada));
      } catch (error) {
        setErrorGeneral(mensajeErrorFiesta(error));
      } finally {
        setCargandoFiesta(false);
      }
    }

    cargar();
  }, [esEdicion, fiestaId]);

  function validar() {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!tematica.trim()) nuevosErrores.tematica = 'La temática es obligatoria.';
    if (!parsearFechaTexto(fechaTexto)) {
      nuevosErrores.fecha = 'Usá el formato DD/MM/AAAA HH:MM con una fecha real.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function guardar() {
    setErrorGeneral('');
    if (!validar()) return;

    const datos = {
      nombre: nombre.trim(),
      tematica: tematica.trim(),
      descripcion: descripcion.trim(),
      fecha: parsearFechaTexto(fechaTexto),
      color,
      destacada,
    };

    setGuardando(true);
    try {
      if (esEdicion) {
        // Solo se mandan los campos del formulario: preventas, rrpp, ubicación e imagen no se pisan
        await actualizarFiesta(fiestaId, datos);
      } else {
        await crearFiesta(usuario.uid, {
          ...datos,
          preventas: [],
          rrpp: [],
          ubicacion: null,
          imagenUri: null,
        });
      }
      navigation.goBack();
    } catch (error) {
      setErrorGeneral(mensajeErrorFiesta(error));
      setGuardando(false);
    }
  }

  if (cargandoFiesta) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
        <FormInput
          etiqueta="Nombre de la fiesta"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Wild Fest"
          error={errores.nombre}
        />
        <FormInput
          etiqueta="Temática"
          value={tematica}
          onChangeText={setTematica}
          placeholder="Ej: Jungle & Neon"
          error={errores.tematica}
        />
        <FormInput
          etiqueta="Fecha y hora"
          value={fechaTexto}
          onChangeText={setFechaTexto}
          placeholder="DD/MM/AAAA HH:MM"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          error={errores.fecha}
        />
        <FormInput
          etiqueta="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Contá de qué se trata la fiesta"
          multiline
        />

        <Text style={styles.etiqueta}>Color</Text>
        <ColorPicker valor={color} onCambiar={setColor} />

        <View style={styles.filaSwitch}>
          <Text style={styles.textoSwitch}>Destacada</Text>
          <Switch
            value={destacada}
            onValueChange={setDestacada}
            trackColor={{ false: '#2A2A35', true: color }}
            thumbColor="#FFFFFF"
          />
        </View>

        {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}

        <CustomButton
          titulo={esEdicion ? 'Guardar cambios' : 'Crear fiesta'}
          onPress={guardar}
          cargando={guardando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  contenedor: {
    padding: 20,
    paddingBottom: 40,
  },
  etiqueta: {
    color: theme.colors.secondary,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  filaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  textoSwitch: {
    color: theme.colors.text,
    fontSize: 16,
  },
  errorGeneral: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
});
