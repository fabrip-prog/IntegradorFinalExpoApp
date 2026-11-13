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

/**
 * Convierte un texto "DD/MM/AAAA HH:MM" en un Date.
 * Devuelve null si el formato es incorrecto o la fecha no existe (ej. 31/02).
 * @param {string} texto
 * @returns {Date|null}
 */
export function parsearFechaTexto(texto) {
  const coincidencia = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec((texto || '').trim());
  if (!coincidencia) return null;

  const [, dia, mes, anio, horas, minutos] = coincidencia.map(Number);
  if (horas > 23 || minutos > 59) return null;

  const fecha = new Date(anio, mes - 1, dia, horas, minutos);
  // Si el día no existe, Date lo "corre" al mes siguiente: así lo detectamos
  if (fecha.getDate() !== dia || fecha.getMonth() !== mes - 1) return null;

  return fecha;
}

/**
 * Convierte una fecha al texto "DD/MM/AAAA HH:MM" que usa el formulario.
 * @param {Date|Object|string} date
 * @returns {string}
 */
export function fechaATexto(date) {
  const d = normalizarFecha(date);
  if (!d) return '';

  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const horas = String(d.getHours()).padStart(2, '0');
  const minutos = String(d.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${d.getFullYear()} ${horas}:${minutos}`;
}

/**
 * Calcula cuánto falta para una fecha, separado en días, horas, minutos y segundos.
 * Devuelve null si la fecha ya pasó.
 * @param {Date|Object|string} date
 * @returns {{dias:number, horas:number, minutos:number, segundos:number}|null}
 */
export function tiempoRestante(date) {
  const d = normalizarFecha(date);
  if (!d) return null;

  const diferencia = d.getTime() - Date.now();
  if (diferencia <= 0) return null;

  const totalSegundos = Math.floor(diferencia / 1000);
  return {
    dias: Math.floor(totalSegundos / 86400),
    horas: Math.floor((totalSegundos % 86400) / 3600),
    minutos: Math.floor((totalSegundos % 3600) / 60),
    segundos: totalSegundos % 60,
  };
}
