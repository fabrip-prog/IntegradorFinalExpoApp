import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export function registrarUsuario(email, password) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function cerrarSesion() {
  return signOut(auth);
}

const MENSAJES_ERROR = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/network-request-failed': 'No hay conexión a internet. Probá de nuevo.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá un momento y probá de nuevo.',
};

export function traducirErrorAuth(code) {
  return MENSAJES_ERROR[code] || 'Ocurrió un error inesperado. Probá de nuevo.';
}
