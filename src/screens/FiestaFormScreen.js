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
import FlyerPicker from '../components/FlyerPicker';
import FormInput from '../components/FormInput';
import PreventaItemForm from '../components/PreventaItemForm';
import RrppItemForm from '../components/RrppItemForm';
import UbicacionPicker from '../components/UbicacionPicker';
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
  const [preventas, setPreventas] = useState([]);
  const [rrpp, setRrpp] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const [imagenUri, setImagenUri] = useState(null);

  const [errores, setErrores] = useState({});
  const [erroresPreventas, setErroresPreventas] = useState([]);
  const [erroresRrpp, setErroresRrpp] = useState([]);
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
        setPreventas(
          Array.isArray(fiesta.preventas)
            ? fiesta.preventas.map((item) => ({
                ...item,
                nombre: item.nombre || '',
                precio: item.precio ?? '',
                inicio: item.inicio || '',
                fin: item.fin || '',
              }))
            : []
        );
        setUbicacion(fiesta.ubicacion || null);
        setImagenUri(fiesta.imagenUri || null);
        setRrpp(
          Array.isArray(fiesta.rrpp)
            ? fiesta.rrpp.map((item) => ({
                ...item,
                nombre: item.nombre || '',
                zona: item.zona || '',
                telefono: item.telefono || '',
              }))
            : []
        );
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
    const nuevosErroresPreventas = preventas.map((item) => {
      const errorItem = {};
      if (!item.nombre.trim()) errorItem.nombre = 'El nombre es obligatorio.';
      const precio = Number(item.precio);
      if (!Number.isFinite(precio) || precio <= 0) {
        errorItem.precio = 'El precio debe ser mayor a $0.';
      }
      return errorItem;
    });
    const nuevosErroresRrpp = rrpp.map((item) => {
      const errorItem = {};
      if (!item.nombre.trim()) errorItem.nombre = 'El nombre es obligatorio.';
      const digitos = String(item.telefono || '').replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 15) {
        errorItem.telefono = 'Ingresá entre 10 y 15 dígitos, incluido el código de país.';
      }
      return errorItem;
    });
    setErrores(nuevosErrores);
    setErroresPreventas(nuevosErroresPreventas);
    setErroresRrpp(nuevosErroresRrpp);
    return (
      Object.keys(nuevosErrores).length === 0 &&
      nuevosErroresPreventas.every((item) => Object.keys(item).length === 0) &&
      nuevosErroresRrpp.every((item) => Object.keys(item).length === 0)
    );
  }

  function cambiarPreventa(index, campo, valor) {
    setPreventas((actuales) =>
      actuales.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    );
    setErroresPreventas((actuales) =>
      actuales.map((item, i) => (i === index ? { ...item, [campo]: undefined } : item))
    );
  }

  function cambiarRrpp(index, campo, valor) {
    setRrpp((actuales) =>
      actuales.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    );
    setErroresRrpp((actuales) =>
      actuales.map((item, i) => (i === index ? { ...item, [campo]: undefined } : item))
    );
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
      preventas: preventas.map((item) => ({
        ...item,
        nombre: item.nombre.trim(),
        precio: Number(item.precio),
        inicio: item.inicio.trim(),
        fin: item.fin.trim(),
      })),
      rrpp: rrpp.map((item) => ({
        ...item,
        nombre: item.nombre.trim(),
        zona: item.zona.trim(),
        telefono: String(item.telefono || '').replace(/\D/g, ''),
      })),
      ubicacion,
      imagenUri,
    };

    setGuardando(true);
    try {
      if (esEdicion) {
        await actualizarFiesta(fiestaId, datos);
      } else {
        await crearFiesta(usuario.uid, datos);
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

        <Text style={styles.tituloSeccion}>Flyer</Text>
        <FlyerPicker valor={imagenUri} onCambiar={setImagenUri} color={color} />

        <Text style={styles.tituloSeccion}>Ubicación</Text>
        <UbicacionPicker valor={ubicacion} onCambiar={setUbicacion} color={color} />

        <Text style={styles.tituloSeccion}>Preventas</Text>
        {preventas.map((item, index) => (
          <PreventaItemForm
            key={`preventa-${index}`}
            item={item}
            index={index}
            errores={erroresPreventas[index]}
            onChange={(campo, valor) => cambiarPreventa(index, campo, valor)}
            onQuitar={() => {
              setPreventas((actuales) => actuales.filter((_, i) => i !== index));
              setErroresPreventas((actuales) => actuales.filter((_, i) => i !== index));
            }}
          />
        ))}
        <CustomButton
          titulo="+ Agregar preventa"
          variante="secundario"
          onPress={() => {
            setPreventas((actuales) => [
              ...actuales,
              { nombre: `Preventa ${actuales.length + 1}`, precio: '', inicio: '', fin: '' },
            ]);
            setErroresPreventas((actuales) => [...actuales, {}]);
          }}
        />

        <Text style={styles.tituloSeccion}>Vendedores RRPP</Text>
        {rrpp.map((item, index) => (
          <RrppItemForm
            key={`rrpp-${index}`}
            item={item}
            index={index}
            errores={erroresRrpp[index]}
            onChange={(campo, valor) => cambiarRrpp(index, campo, valor)}
            onQuitar={() => {
              setRrpp((actuales) => actuales.filter((_, i) => i !== index));
              setErroresRrpp((actuales) => actuales.filter((_, i) => i !== index));
            }}
          />
        ))}
        <CustomButton
          titulo="+ Agregar vendedor"
          variante="secundario"
          onPress={() => {
            setRrpp((actuales) => [...actuales, { nombre: '', zona: '', telefono: '' }]);
            setErroresRrpp((actuales) => [...actuales, {}]);
          }}
        />

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
  tituloSeccion: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
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
