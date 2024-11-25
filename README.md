
# Proyecto de Gestión de Productos

Este proyecto es una aplicación web diseñada para la gestión de productos, incluyendo funciones como búsqueda, filtrado, actualización, eliminación, y registro de ventas. Está construido con React, Chakra UI, Firebase, y otras tecnologías modernas. A continuación, se detalla cómo funciona y cómo configurarlo.

## Funcionalidades principales

- **Gestión de productos**:
  - Visualización de productos en tarjetas.
  - Función de búsqueda integrada con un filtro en tiempo real.
  - Actualización de la cantidad de productos disponibles.
  - Eliminación de productos (solo para roles autorizados).
  - Creación automática de ventas al reducir la cantidad de productos.

- **Roles y autenticación**:
  - Integración con Firebase Authentication para manejar el acceso de usuarios.
  - Roles específicos (`dueno`, `gerente`, y otros) con permisos diferenciados.

- **Visualización dinámica**:
  - Las tarjetas de productos se actualizan automáticamente según el término de búsqueda.
  - Manejo en tiempo real de las actualizaciones de productos.

- **Gráficos**:
  - Visualización de estadísticas utilizando la biblioteca **Recharts**.

---

## Requisitos previos

Asegúrate de tener las siguientes herramientas instaladas:

1. **Node.js** (versión 14 o superior)
2. **npm** o **yarn** como gestor de paquetes.
3. Una cuenta de Firebase configurada con Authentication y Firestore.

---

## Instalación y configuración

Sigue estos pasos para configurar el proyecto en tu máquina local:

### 1. Clona el repositorio

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instala las dependencias

Ejecuta el siguiente comando para instalar las dependencias principales:

```bash
npm install
```

### 3. Instala dependencias adicionales

Debido aque el  `package.json` no se agrega recharts por una falla de recharts, debes instalar manualmente la biblioteca **Recharts**:

```bash
npm install recharts
```

Esto asegura que las gráficas se rendericen correctamente.

### 4. Configura Firebase

1. Ve a la consola de Firebase y configura un proyecto.
2. Habilita **Authentication** y crea un esquema de Firestore.
3. Copia tu configuración de Firebase en un archivo `firebase-config.js` dentro del proyecto:

   ```javascript
   import { initializeApp } from 'firebase/app';

   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_AUTH_DOMAIN",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_STORAGE_BUCKET",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID"
   };

   const app = initializeApp(firebaseConfig);

   export default app;
   ```

### 5. Inicia el servidor

Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## Uso de la aplicación

### Roles y permisos

- **Dueño**:
  - Acceso completo (agregar, editar, eliminar productos, y visualizar estadísticas).
- **Gerente**:
  - Acceso a la gestión de productos y estadísticas.
- **Otros usuarios**:
  - Solo pueden visualizar productos disponibles.

### Navegación

- Al iniciar sesión, serás redirigido a la página de productos.
- Usa la barra de búsqueda para filtrar productos en tiempo real.
- Haz clic en una tarjeta de producto para ver detalles, editar la cantidad, o eliminar (si tienes permisos).

### Gráficos

- Accede a la sección de **Gráficas** para ver estadísticas basadas en los datos almacenados.

---

## Consideraciones importantes

- **Manejo de errores**: Si algo falla (por ejemplo, no puedes conectarte a Firebase o a la API), revisa la consola para ver mensajes de error.
- **Datos de ejemplo**: Puedes poblar la base de datos de Firestore con productos iniciales para pruebas.

---

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).
