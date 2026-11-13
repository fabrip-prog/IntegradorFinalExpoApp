// Región por defecto del mapa (Buenos Aires) cuando no hay otra referencia
export const REGION_INICIAL = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

/**
 * Arma una región de mapa centrada en un punto { latitud, longitud }.
 */
export function regionDesdeUbicacion(ubicacion, zoom = 0.02) {
  return {
    latitude: ubicacion.latitud,
    longitude: ubicacion.longitud,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  };
}

/**
 * Arma una región que contiene todas las ubicaciones recibidas.
 * Devuelve null si la lista está vacía.
 */
export function regionQueContiene(ubicaciones) {
  if (!ubicaciones.length) return null;

  const latitudes = ubicaciones.map((u) => u.latitud);
  const longitudes = ubicaciones.map((u) => u.longitud);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.05),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.05),
  };
}

/**
 * Link de Google Maps para que el usuario sepa cómo llegar.
 */
export function linkComoLlegar(ubicacion) {
  return `https://www.google.com/maps/search/?api=1&query=${ubicacion.latitud},${ubicacion.longitud}`;
}
