import * as Location from 'expo-location';

/**
 * Pide permiso para usar la ubicación mientras la app está abierta.
 * @returns {Promise<boolean>} true si el usuario aceptó.
 */
export async function pedirPermisoUbicacion() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Obtiene la ubicación actual del dispositivo.
 * Lanza un Error con mensaje en español si el GPS está apagado o falla.
 * @returns {Promise<{latitud:number, longitud:number}>}
 */
export async function obtenerUbicacionActual() {
  const gpsActivo = await Location.hasServicesEnabledAsync();
  if (!gpsActivo) {
    throw new Error('El GPS está apagado. Activalo e intentá de nuevo.');
  }

  try {
    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
    };
  } catch {
    throw new Error('No se pudo obtener tu ubicación. Intentá de nuevo.');
  }
}

/**
 * Convierte coordenadas en una dirección legible ("calle número, ciudad").
 * Devuelve '' si no se puede obtener.
 * @param {number} latitud
 * @param {number} longitud
 * @returns {Promise<string>}
 */
export async function obtenerDireccion(latitud, longitud) {
  try {
    const resultados = await Location.reverseGeocodeAsync({ latitude: latitud, longitude: longitud });
    const lugar = resultados?.[0];
    if (!lugar) return '';

    const calle = [lugar.street, lugar.streetNumber].filter(Boolean).join(' ');
    const ciudad = lugar.city || lugar.subregion || lugar.region || '';
    return [calle, ciudad].filter(Boolean).join(', ');
  } catch {
    return '';
  }
}
