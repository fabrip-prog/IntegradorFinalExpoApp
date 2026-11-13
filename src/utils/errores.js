/**
 * Traduce los errores de Firestore a un mensaje en español para mostrar en pantalla.
 * @param {Error} error
 * @returns {string}
 */
export function mensajeErrorFiesta(error) {
  if (error?.code === 'permission-denied') return 'No tenés permiso para ver esta fiesta.';
  if (error?.code === 'unavailable') return 'No hay conexión. Probá de nuevo.';
  return 'Ocurrió un error. Probá de nuevo.';
}
