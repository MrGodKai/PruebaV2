# PowerCar

Aplicación móvil para talleres mecánicos.

## Funcionalidad inicial
- Login con selección de rol: Administrador, Mecánico, Usuario
- Navegación a pantallas placeholder según rol

## Tecnologías
- React Native (Expo)
- React Navigation

## Próximos pasos
- Implementar chat y comunicación en tiempo real
- Conectar con backend y roles reales

---

Para probar la app:
1. Instala dependencias con `npm install` o `yarn install`.
2. Inicia el proyecto con `npx expo start`.
3. Escanea el QR con Expo Go en tu celular.

---

# PowerCar App

Este es un proyecto React Native (Expo) con chat, grupos y subida de imágenes usando Firebase y Cloudinary.

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/TU_USUARIO/TU_REPO.git
   cd TU_REPO
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Crea tu archivo `firebaseConfig.js` en la raíz, con tu configuración de Firebase:
   ```js
   // firebaseConfig.js (ejemplo)
   export const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## Uso

- Ejecuta la app con:
  ```sh
  npx expo start
  ```
- Puedes crear grupos, añadir/eliminar miembros y enviar mensajes e imágenes.

## Notas
- No subas tus claves reales de Firebase a GitHub.
- Si restauras el proyecto, solo necesitas poner tu `firebaseConfig.js` y hacer `npm install`.

---

Cualquier duda, revisa este README o pregunta a tu asistente IA.
