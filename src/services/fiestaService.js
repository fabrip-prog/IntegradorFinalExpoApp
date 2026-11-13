import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLECCION_FIESTAS = 'fiestas';

/**
 * Convierte un Timestamp de Firestore (o fecha) a un objeto Date nativo.
 */
function timestampADate(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return valor;
  if (typeof valor.toDate === 'function') return valor.toDate();
  const d = new Date(valor);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Convierte un objeto Date a Timestamp de Firestore.
 */
function dateATimestamp(valor) {
  if (!valor) return null;
  if (typeof valor.toDate === 'function') return valor;
  if (valor instanceof Date) return Timestamp.fromDate(valor);
  const d = new Date(valor);
  return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
}

/**
 * Mapea un DocumentSnapshot de Firestore al formato de objeto Fiesta.
 * Devuelve cada fiesta como { id, ...datos, fecha: Date }.
 */
function formatearFiestaDoc(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    fecha: timestampADate(data?.fecha),
  };
}

/**
 * Crea una nueva fiesta en Firestore asociada al usuario productor.
 * @param {string} uid - ID del usuario autenticado.
 * @param {Object} datos - Datos de la fiesta (nombre, tematica, color, fecha, etc.).
 * @returns {Promise<Object>} Fiesta creada con su id y fecha como Date.
 */
export async function crearFiesta(uid, datos) {
  const { id: _id, userId: _userId, creadaEn: _creadaEn, ...restoDatos } = datos;

  const fechaTimestamp = dateATimestamp(restoDatos.fecha) || Timestamp.fromDate(new Date());

  const payload = {
    ...restoDatos,
    userId: uid,
    creadaEn: serverTimestamp(),
    fecha: fechaTimestamp,
  };

  const coleccionRef = collection(db, COLECCION_FIESTAS);
  const docRef = await addDoc(coleccionRef, payload);

  return {
    id: docRef.id,
    ...restoDatos,
    userId: uid,
    fecha: fechaTimestamp.toDate(),
  };
}

/**
 * Obtiene todas las fiestas pertenecientes al usuario especificado.
 * Ordena por fecha en JavaScript (no con orderBy de Firestore para no requerir índice compuesto).
 * @param {string} uid - ID del usuario.
 * @returns {Promise<Array<Object>>} Lista de fiestas ordenadas por fecha.
 */
export async function obtenerFiestasDeUsuario(uid) {
  const coleccionRef = collection(db, COLECCION_FIESTAS);
  const consulta = query(coleccionRef, where('userId', '==', uid));
  const snapshot = await getDocs(consulta);

  const fiestas = snapshot.docs.map(formatearFiestaDoc);

  // Ordenar por fecha en JavaScript de forma ascendente
  fiestas.sort((a, b) => {
    const timeA = a.fecha instanceof Date ? a.fecha.getTime() : 0;
    const timeB = b.fecha instanceof Date ? b.fecha.getTime() : 0;
    return timeA - timeB;
  });

  return fiestas;
}

/**
 * Obtiene los detalles de una fiesta específica por su ID.
 * @param {string} id - ID del documento de la fiesta.
 * @returns {Promise<Object|null>} Fiesta o null si no existe.
 */
export async function obtenerFiesta(id) {
  const docRef = doc(db, COLECCION_FIESTAS, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return formatearFiestaDoc(docSnap);
}

/**
 * Actualiza una fiesta existente en Firestore.
 * Garantiza que nunca se altere el userId ni creadaEn.
 * @param {string} id - ID de la fiesta.
 * @param {Object} datos - Campos a actualizar.
 * @returns {Promise<void>}
 */
export async function actualizarFiesta(id, datos) {
  // Se excluyen deliberadamente userId, creadaEn e id para proteger la integridad de los datos
  const { userId, creadaEn, id: _id, ...datosAActualizar } = datos;

  if (datosAActualizar.fecha !== undefined) {
    datosAActualizar.fecha = dateATimestamp(datosAActualizar.fecha);
  }

  const docRef = doc(db, COLECCION_FIESTAS, id);
  await updateDoc(docRef, datosAActualizar);
}

/**
 * Elimina una fiesta de Firestore por su ID.
 * @param {string} id - ID de la fiesta.
 * @returns {Promise<void>}
 */
export async function eliminarFiesta(id) {
  const docRef = doc(db, COLECCION_FIESTAS, id);
  await deleteDoc(docRef);
}
