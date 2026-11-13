// Pronóstico del clima con la API pública de Open-Meteo (no necesita clave)
const URL_BASE = 'https://api.open-meteo.com/v1/forecast';

// Open-Meteo solo pronostica hasta 16 días hacia adelante
export const DIAS_MAXIMOS_PRONOSTICO = 16;

// Códigos WMO que devuelve la API, agrupados en textos simples
const DESCRIPCIONES = [
  { codigos: [0], texto: 'Despejado', icono: '☀️' },
  { codigos: [1, 2], texto: 'Parcialmente nublado', icono: '⛅' },
  { codigos: [3], texto: 'Nublado', icono: '☁️' },
  { codigos: [45, 48], texto: 'Niebla', icono: '🌫️' },
  { codigos: [51, 53, 55, 56, 57], texto: 'Llovizna', icono: '🌦️' },
  { codigos: [61, 63, 65, 66, 67, 80, 81, 82], texto: 'Lluvia', icono: '🌧️' },
  { codigos: [71, 73, 75, 77, 85, 86], texto: 'Nieve', icono: '❄️' },
  { codigos: [95, 96, 99], texto: 'Tormenta', icono: '⛈️' },
];

/**
 * Traduce un código WMO a texto e ícono.
 * @param {number} codigo
 * @returns {{texto:string, icono:string}}
 */
function describirCodigo(codigo) {
  const encontrado = DESCRIPCIONES.find((d) => d.codigos.includes(codigo));
  return encontrado || { texto: 'Sin datos', icono: '❔' };
}

/**
 * Arma "AAAA-MM-DD" con la fecha LOCAL (toISOString la pasaría a UTC y podría cambiar el día).
 * @param {Date} fecha
 * @returns {string}
 */
function fechaParaApi(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/**
 * Consulta el pronóstico para un lugar y un día.
 * Lanza un Error con mensaje en español si la consulta falla.
 * @param {number} latitud
 * @param {number} longitud
 * @param {Date} fecha
 * @returns {Promise<{descripcion:string, icono:string, maxima:number, minima:number, probLluvia:number}>}
 */
export async function obtenerPronostico(latitud, longitud, fecha) {
  const dia = fechaParaApi(fecha);
  const url =
    `${URL_BASE}?latitude=${latitud}&longitude=${longitud}` +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    `&timezone=auto&start_date=${dia}&end_date=${dia}`;

  let respuesta;
  try {
    respuesta = await fetch(url);
  } catch {
    throw new Error('No hay conexión para consultar el clima.');
  }

  if (!respuesta.ok) {
    throw new Error('El servicio del clima no respondió. Probá más tarde.');
  }

  const datos = await respuesta.json();
  const diario = datos?.daily;
  if (!diario || !diario.time?.length) {
    throw new Error('No hay pronóstico disponible para ese día.');
  }

  const { texto, icono } = describirCodigo(diario.weather_code[0]);
  return {
    descripcion: texto,
    icono,
    maxima: Math.round(diario.temperature_2m_max[0]),
    minima: Math.round(diario.temperature_2m_min[0]),
    probLluvia: diario.precipitation_probability_max[0] ?? 0,
  };
}