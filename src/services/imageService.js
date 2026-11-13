import * as ImagePicker from 'expo-image-picker';

const OPCIONES = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 5],
  quality: 0.7,
};

export async function elegirDeGaleria() {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    throw new Error('No diste permiso para acceder a tus fotos.');
  }

  const resultado = await ImagePicker.launchImageLibraryAsync(OPCIONES);
  if (resultado.canceled) return null;
  return resultado.assets[0].uri;
}

export async function sacarFoto() {
  const permiso = await ImagePicker.requestCameraPermissionsAsync();
  if (!permiso.granted) {
    throw new Error('No diste permiso para usar la cámara.');
  }

  const resultado = await ImagePicker.launchCameraAsync(OPCIONES);
  if (resultado.canceled) return null;
  return resultado.assets[0].uri;
}
