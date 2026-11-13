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
import { iniciarSesion, traducirErrorAuth } from '../services/authService';
import { theme } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function validar() {
    const nuevosErrores = {};
    if (!email.includes('@')) nuevosErrores.email = 'Ingresá un email válido.';
    if (!password) nuevosErrores.password = 'Ingresá tu contraseña.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function manejarLogin() {
    setErrorGeneral('');
    if (!validar()) return;
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      // No hace falta navegar: AppNavigator cambia solo al AppStack
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
        <Text style={styles.titulo}>FiestaApp</Text>
        <Text style={styles.subtitulo}>Ingresá para gestionar tus fiestas</Text>

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
          placeholder="••••••"
          secureTextEntry
          autoCapitalize="none"
          error={errores.password}
        />

        {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}

        <CustomButton titulo="Ingresar" onPress={manejarLogin} cargando={cargando} />

        <Pressable onPress={() => navigation.navigate('Registro')} style={styles.link}>
          <Text style={styles.linkTexto}>
            ¿No tenés cuenta? <Text style={styles.linkDestacado}>Registrate</Text>
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
    fontSize: 40,
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
