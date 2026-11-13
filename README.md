# FiestaApp

Aplicación móvil para productores de fiestas. Es la versión móvil de [FiestaWeb](https://github.com/fabrip-prog/FiestaWeb), desarrollada como Trabajo Práctico Integrador Final de la materia **Desarrollo de aplicativos móviles**.

## Objetivo

Muchos productores de fiestas organizan todo por Instagram y WhatsApp: la fecha, las preventas, los vendedores (RRPP) y dónde es el evento quedan repartidos en mensajes y publicaciones. FiestaApp junta todo en un solo lugar: cada productor se registra, carga sus fiestas y tiene a mano la información que necesita para venderlas.

## Funcionalidades

- **Cuenta de productor:** registro, inicio y cierre de sesión con Firebase Authentication. Las pantallas privadas solo se ven con la sesión iniciada.
- **Fiestas (CRUD completo en Cloud Firestore):** crear, listar, ver, editar y eliminar fiestas con nombre, temática, fecha y hora, descripción, color y marca de destacada.
- **Flyer (funcionalidad complementaria A):** se elige una imagen de la galería o se saca una foto con expo-image-picker, y su URI se guarda en la fiesta. Se ve de fondo en el detalle y como miniatura en las tarjetas.
- **Cuenta regresiva** hasta la fecha de cada fiesta.
- **Preventas:** fases de venta con precio y fechas de inicio y fin; las vencidas se marcan.
- **Vendedores RRPP:** nombre, zona y teléfono, con un botón que abre WhatsApp con un mensaje listo para pedir entradas.
- **Ubicación y mapas (funcionalidad complementaria B):** se marca dónde es la fiesta tocando el mapa o con el GPS (expo-location), se muestra la dirección, un mapa en el detalle con botón "Cómo llegar" y una pestaña con todas las fiestas en el mapa (react-native-maps).
- **Clima (funcionalidad complementaria C):** pronóstico para el día de la fiesta en su ubicación, consultado con `fetch()` a la API pública de [Open-Meteo](https://open-meteo.com/), con estados de carga, error y reintento.
- **Inicio:** la próxima fiesta con su cuenta regresiva, las fiestas destacadas y un resumen de próximas y finalizadas.
- **Perfil:** email, fecha de alta, cantidad de fiestas y cierre de sesión.

## Tecnologías utilizadas

- React Native y Expo (SDK 58), con JavaScript
- React Navigation (native-stack y bottom-tabs)
- Firebase Authentication (email y contraseña), con la sesión guardada en AsyncStorage
- Cloud Firestore
- expo-image-picker
- expo-location
- react-native-maps
- `fetch()` con la API REST de Open-Meteo

## Estructura del proyecto

```
src/
├── components/   Componentes reutilizables (botones, inputs, tarjetas, mapa, clima)
├── context/      AuthContext: usuario logueado y estado de la sesión
├── firebase/     Inicialización de Firebase (lee la configuración de .env)
├── navigation/   AppNavigator, AuthStack (público) y AppStack (privado)
├── screens/      Login, Registro, Inicio, Mis fiestas, Detalle, Formulario, Mapa, Perfil
├── services/     Lógica de Firebase, GPS, imágenes y API del clima
├── utils/        Funciones auxiliares (fechas, precios, mapas, errores)
└── theme.js      Paleta de colores
```

## Modelo de datos

Colección `fiestas`, un documento por fiesta:

```js
{
  nombre: 'Wild Fest',
  tematica: 'Jungle & Neon',
  color: '#39FF14',
  fecha: Timestamp,
  descripcion: '...',
  destacada: false,
  imagenUri: 'file:///...' | null,
  ubicacion: { latitud, longitud, direccion } | null,
  preventas: [{ nombre, precio, inicio, fin }],
  rrpp: [{ nombre, zona, telefono }],
  userId: 'UID_DEL_PRODUCTOR',
  creadaEn: Timestamp
}
```

Cada documento guarda el `uid` de su dueño en `userId`. Las consultas filtran por ese campo y las Security Rules de [`firestore.rules`](firestore.rules) solo permiten leer, editar o borrar una fiesta a su dueño, y crearla con su propio `uid`.

## Instalación y ejecución

1. Clonar el repositorio e instalar las dependencias:
   ```
   git clone https://github.com/fabrip-prog/IntegradorFinalExpoApp.git
   cd IntegradorFinalExpoApp
   npm install
   ```
2. En la [consola de Firebase](https://console.firebase.google.com/), crear un proyecto, registrar una app web, activar **Authentication > Correo electrónico/contraseña** y crear una base de **Cloud Firestore**.
3. Copiar `.env.example` como `.env` y completar las 6 variables `EXPO_PUBLIC_FIREBASE_...` con los datos de la app web de Firebase.
4. Publicar las reglas: copiar el contenido de `firestore.rules` en **Firestore > Reglas** y tocar "Publicar".
5. Iniciar la app:
   ```
   npx expo start
   ```
6. Escanear el código QR con **Expo Go** en el celular (Android o iOS).

## Integrantes

**Fabrizio Pérez**

- Etapa 1: Configuración inicial de Expo, Firebase y navegación
- Etapa 3: Servicio de Firestore, Security Rules y listado de fiestas
- Etapa 5: Preventas y vendedores RRPP con WhatsApp
- Etapa 7: Pronóstico del clima con API REST
- Etapa 10: Flyer de la fiesta con expo-image-picker

**Leonardo Eckerdt**

- Etapa 2: Registro, inicio y cierre de sesión
- Etapa 4: Crear, editar, ver y eliminar fiestas
- Etapa 6: Ubicación con GPS y mapas
- Etapa 8: Pantallas de Inicio y Perfil
- Etapa 9: README y revisión final

## Limitaciones conocidas

- El flyer se guarda como URI local: solo se ve en el celular donde se eligió, porque no se sube a Firebase Storage. En otro dispositivo se muestra el encabezado de color.
- Los mapas no funcionan en la versión web; la app está pensada para Android y iOS.
- El pronóstico del clima solo está disponible hasta 16 días antes de la fiesta.
- La fecha y hora se ingresan como texto (`DD/MM/AAAA HH:MM`) en lugar de con un selector.
- Las fechas de las preventas no se validan; si se escriben en otro formato, no se marcan como vencidas.
- Las fiestas son privadas de cada productor: no hay una vista pública para compradores como en la web.

## Funciones futuras

- Galería de fotos y álbumes de ediciones pasadas
- Sorteos y sponsors
- Lineup de DJs
- Vista pública para que los compradores vean las fiestas
