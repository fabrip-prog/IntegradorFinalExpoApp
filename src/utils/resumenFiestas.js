/**
 * Calcula los datos que muestra la pantalla de Inicio a partir de la lista de fiestas.
 * Se separa de la pantalla para que el JSX solo se ocupe de mostrar.
 * @param {Array<Object>} fiestas - Fiestas del usuario con fecha como Date.
 * @param {Date} [ahora]
 * @returns {{proxima: Object|null, destacadas: Array<Object>, cantidadProximas: number, cantidadFinalizadas: number}}
 */
export function resumirFiestas(fiestas, ahora = new Date()) {
  const futuras = fiestas
    .filter((f) => f.fecha instanceof Date && f.fecha.getTime() > ahora.getTime())
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  return {
    proxima: futuras[0] || null,
    destacadas: futuras.filter((f) => f.destacada),
    cantidadProximas: futuras.length,
    cantidadFinalizadas: fiestas.length - futuras.length,
  };
}
