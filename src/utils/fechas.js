const DIAS_SEMANA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

/**
 * Normaliza cualquier formato de fecha (Date, Firestore Timestamp o string/number) a un objeto Date.
 */
function normalizarFecha(date) {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date.toDate === 'function') return date.toDate();
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formatea una fecha en formato "sáb 25/12 23:30"
 * @param {Date|Object|string} date 
 * @returns {string}
 */
export function formatearFecha(date) {
  const d = normalizarFecha(date);
  if (!d) return '';

  const diaSemana = DIAS_SEMANA[d.getDay()];
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const horas = String(d.getHours()).padStart(2, '0');
  const minutos = String(d.getMinutes()).padStart(2, '0');

  return `${diaSemana} ${dia}/${mes} ${horas}:${minutos}`;
}

/**
 * Calcula la cantidad de días que faltan para la fecha especificada a partir de hoy.
 * Devuelve un número entero:
 *  > 0 si falta en el futuro (ej. 5 días)
 *  = 0 si es hoy
 *  < 0 si la fecha ya pasó (ej. -2)
 * @param {Date|Object|string} date 
 * @returns {number}
 */
export function diasQueFaltan(date) {
  const d = normalizarFecha(date);
  if (!d) return 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaFiesta = new Date(d);
  fechaFiesta.setHours(0, 0, 0, 0);

  const diffMs = fechaFiesta.getTime() - hoy.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
