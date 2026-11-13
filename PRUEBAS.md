# Pruebas de seguridad con dos usuarios

Objetivo: comprobar que cada productor solo puede ver y modificar sus propias fiestas, tanto en la interfaz como en Firestore (Security Rules de `firestore.rules`).

Fecha de la prueba: 13/11/2026

| # | Paso | Resultado esperado | Resultado obtenido |
|---|------|--------------------|--------------------|
| 1 | Usuario 1 se registra y crea 2 fiestas (una con ubicación). | Las 2 fiestas aparecen en Inicio, Mis fiestas y Mapa del usuario 1. | |
| 2 | Usuario 1 cierra sesión. | Vuelve a la pantalla de Login. | |
| 3 | Usuario 2 se registra con otro email. | Inicio muestra "No tenés fiestas próximas" y Perfil muestra 0 fiestas. | |
| 4 | Usuario 2 revisa Mis fiestas y Mapa. | No aparece ninguna fiesta del usuario 1. | |
| 5 | Usuario 2 intenta abrir el detalle de una fiesta del usuario 1 usando su id. | Firestore responde `permission-denied` y la app muestra "No tenés permiso para ver esta fiesta." | |
| 6 | Usuario 2 crea su propia fiesta. | Solo la ve el usuario 2; al volver a entrar con el usuario 1, no aparece. | |

## Cómo se hizo el paso 5

En `src/screens/FiestaDetailScreen.js` se reemplazó temporalmente `route?.params?.fiestaId` por el id de una fiesta del usuario 1 (copiado desde la consola de Firebase), se abrió cualquier detalle con el usuario 2 y después se volvió a dejar el código como estaba.

## Conclusión

(Completar después de hacer la prueba.)
