import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import FormInput from '../components/FormInput';
import { registrarUsuario, traducirErrorAuth } from '../services/authService';
import { theme } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevosErrores = {};
    if (!email.includes('@')) nuevosErrores.email = 'Ingresá un email válido.';
    if (password.length < 6) nuevosErrores.password = 'Mínimo 6 caracteres.';
    if (confirmacion !== password) nuevosErrores.confirmacion = 'Las contraseñas no coinciden.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarRegistro() {
    setErrorGeneral('');
    if (!validar()) return;
    setCargando(true);
    try {
      // Al registrarse, Firebase deja la sesión iniciada y entra directo a la app
      await registrarUsuario(email, password);
    } catch (error) {
      setErrorGeneral(traducirErrorAuth(error.code));
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Registrate como productor de fiestas</Text>

        <FormInput
          etiqueta="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errores.email}
        />
        <FormInput
          etiqueta="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
          error={errores.password}
        />
        <FormInput
          etiqueta="Repetir contraseña"
          value={confirmacion}
          onChangeText={setConfirmacion}
          placeholder="Repetí la contraseña"
          secureTextEntry
          autoCapitalize="none"
          error={errores.confirmacion}
        />

        {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}

        <CustomButton titulo="Registrarme" onPress={manejarRegistro} cargando={cargando} />

        <Pressable onPress={() => navigation.goBack()} style={styles.link}>
          <Text style={styles.linkTexto}>
            ¿Ya tenés cuenta? <Text style={styles.linkDestacado}>Ingresá</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contenedor: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    color: theme.colors.accent,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitulo: {
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  errorGeneral: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  link: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkTexto: {
    color: theme.colors.secondary,
  },
  linkDestacado: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});
