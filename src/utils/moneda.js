/**
 * Formatea un número o string numérico en formato de moneda en pesos argentinos:
 * Ej: 15000 -> "$15.000", 500 -> "$500"
 * @param {number|string} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  const num = Number(valor);
  if (isNaN(num)) return '$0';

  // Separador de miles con punto
  const partes = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `$${partes}`;
}
