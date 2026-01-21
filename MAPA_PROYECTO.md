# Mapa general del proyecto (PWA)

> Resumen de la estructura de archivos y descripción breve de cada carpeta/archivo relevante.

## 1. Resumen rápido ✅

-   Tipo de proyecto: Progressive Web App (Next.js + TypeScript) con soporte PWA (workbox / next-pwa).
-   Tecnologías principales: Next.js, React, TypeScript, Tailwind CSS, Plotly, Three.js, SQLite.
-   Scripts principales (en `package.json`): `dev`, `build`, `start`, `lint`.

---

## 2. Archivos raíz 🔧

-   `package.json` — scripts y dependencias (Next, React, next-pwa, tailwind, plotly, sqlite, etc.).
-   `next.config.mjs` — configuración de Next + plugin PWA (`@ducanh2912/next-pwa`).
-   `tsconfig.json` — configuración de TypeScript.
-   `tailwind.config.ts`, `postcss.config.mjs` — configuración de Tailwind/PostCSS.
-   `README.md` — documentación del proyecto (puede contener instrucciones de uso).
-   `.eslintrc.json`, `.gitignore`, `next-env.d.ts` — linters/ignores/entorno.

---

## 3. Carpeta `src/` (núcleo de la app) 🧭

-   `src/app/`
    -   `layout.tsx` — layout raíz de la app.
    -   `page.tsx` — página principal / entrypoint del sitio.
    -   `HomeLogic.tsx` — Lógica separada de la página principal.
    -   `globals.css` — estilos globales.
    -   `registerServiceWorker.ts` — registro del service worker (PWA).
    -   Subcarpetas por rutas/páginas: `acercaDe/`, `ayuda/`, `contacto/`, `capas/`, `proyecto/`, `registro/`, `sesion/`, `idioma/`, `oauth-success/`, etc.
    -   `components/` — componentes React reutilizables (modals, menús, botones, vistas).
    -   `css/` — estilos modulares por componente/página (`*.module.css`).
    -   `api/` — rutas API (por ejemplo `auth/*`).

-   `src/auth/` — callbacks para OAuth y `social-callback.ts`.
-   `src/context/` — contextos React (AuthContext, IdiomaContext, MobileContext, ModalContext).
-   `src/lib/` — utilidades de lógica/servicios (`api.ts`, `auth.ts`).
-   `src/utils/` — utilidades (cookies, manejo JWT, etc.).
-   `src/types/` — tipos TypeScript.

---

## 4. Estructura de la carpeta `src/app` (Rutas) 🌳

```text
src/app/
├── acercaDe/
├── ayuda/
├── contacto/
├── capas/
├── idioma/
├── oauth-success/             # Manejo de éxito post-OAuth
├── registro/
│   ├── RegistroLogic.tsx      # Lógica del formulario de registro
│   └── page.tsx
├── sesion/
│   ├── SesionLogic.tsx        # Lógica del formulario de sesión
│   └── page.tsx
├── proyecto/                  # Gestión de proyectos (Estructura compleja)
│   ├── @aside/                # Parallel Route: Sidebars
│   ├── @main/                 # Parallel Route: Contenido Principal
│   ├── GCode/                 # Generación de G-Code
│   ├── crearProyecto/         # Creación de nuevos proyectos
│   ├── liner/                 # Configuración de Liners
│   ├── maquina/               # Configuración de Máquinas
│   ├── MenuProyecto.tsx       # Menú específico de la sección
│   ├── ProyectoContext.tsx    # Contexto local del proyecto
│   ├── layout.tsx
│   └── page.tsx
├── HomeLogic.tsx              # Lógica de la página principal
├── layout.tsx
├── page.tsx
└── registerServiceWorker.ts
```

---

## 4. Carpeta `public/` (recursos estáticos) 🖼️

-   `manifest.json`, iconos, imágenes y carpeta `images/` con subcarpetas `icons/`, `patrones/` (muchos PNG de patrones usados por la app).
-   Service worker y Workbox: `sw.js`, `service-worker.js`, `workbox-*.js`, `swe-worker-*.js`.

---

## 5. Internacionalización 🌍

-   `traducciones/` — JSONs con traducciones: `es.json`, `en.json`, `de.json`, `pt.json`.
-   `next-intl` está en dependencias (gestiona i18n con Next).

---

## 6. Scripts/outros y carpetas auxiliares 🧪

-   `python/` — scripts Python (`funcion_capa.py`) (posiblemente herramientas de procesamiento fuera de la app web).
-   `path_pruebas/` — archivos de pruebas/experimentación (`plotly.js`, `pruebas.md`).

---

## 7. Puntos de entrada y rutas importantes 📌

-   App: `src/app/page.tsx` (home), `src/app/layout.tsx` (layout root).
-   API auth: `src/app/api/auth/{login,register,logout,session,...}`.
-   Callbacks OAuth: `src/auth/callback/{google,microsoft,facebook}/route.ts`.
-   Registro del service worker: `src/app/registerServiceWorker.ts` y archivos en `public/`.

---

## 8. Cómo ejecutar (resumen) ▶️

-   Instalar dependencias: `npm install`.
-   Modo desarrollo: `npm run dev` (usa Turbopack según `package.json`).
-   Build para producción: `npm run build` y `npm start`.

---

## 9. Observaciones y recomendaciones 💡

-   El proyecto ya está preparado como PWA (`next-pwa` configurado) y contiene numerosos recursos estáticos (muestras/patrones).
-   Las traducciones están centralizadas en `traducciones/` — útil para añadir nuevos idiomas.


---

# Mapa detallado del proyecto

Este documento lista componentes, páginas, rutas API, contexts y utilidades principales con enlaces a los archivos en el repositorio.

## Componentes (src/app/components)

| Componente              | Ruta                                           | Descripción breve                                             |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `BotonSesion`           | `src/app/components/BotonSesion.tsx`           | Botón para iniciar/cerrar sesión, muestra estado del usuario. |
| `AsideProyecto`         | `src/app/components/AsideProyecto.tsx`         | Panel lateral que muestra información del proyecto.           |
| `AsideCapas`            | `src/app/components/AsideCapas.tsx`            | Panel lateral para gestión de capas.                          |
| `MenuItem`              | `src/app/components/MenuItem.tsx`              | Item reutilizable para menús.                                 |
| `MenuIdioma`            | `src/app/components/MenuIdioma.tsx`            | Selector de idioma.                                           |
| `MenuHome`              | `src/app/components/MenuHome.tsx`              | Menú principal de la home.                                    |
| `MenuCapas`             | `src/app/components/MenuCapas.tsx`             | Menú específico para la sección de capas.                     |
| `MenuAyuda`             | `src/app/components/MenuAyuda.tsx`             | Menú para la sección ayuda/FAQ.                               |
| `MenuAcercaDe`          | `src/app/components/MenuAcercaDe.tsx`          | Menú para la sección "Acerca de".                             |
| `IconosSVG`             | `src/app/components/IconosSVG.tsx`             | Contenedor de iconos SVG usados en la app.                    |
| `MenuList`              | `src/app/components/MenuList.tsx`              | Lista genérica para menús.                                    |
| `component`             | `src/app/components/component.tsx`             | Componente base (nomenclatura genérica).                      |
| `WrapperLayoutPage`     | `src/app/components/WrapperLayoutPage.tsx`     | Wrapper para páginas con layout compartido.                   |
| `VerBobinados`          | `src/app/components/VerBobinados.tsx`          | Vista/listado de bobinados.                                   |
| `UserBadge`             | `src/app/components/UserBadge.tsx`             | Indicador de usuario (avatar, nombre).                        |
| `TranslatedFooter`      | `src/app/components/TranslatedFooter.tsx`      | Footer con textos traducibles.                                |
| `ProjectForm`           | `src/app/components/ProjectForm.tsx`           | Formulario para crear/editar proyectos.                       |
| `OrientationHandler`    | `src/app/components/OrientationHandler.tsx`    | Maneja orientación/dispositivos.                              |
| `NavItems`              | `src/app/components/NavItems.tsx`              | Items de navegación (header/nav).                             |
| `MostrarCapas`          | `src/app/components/MostrarCapas.tsx`          | Componente para mostrar capas/colecciones.                    |
| `MostrarBobinado`       | `src/app/components/MostrarBobinado.tsx`       | Vista detallada de un bobinado.                               |
| `ModalVerPatron`        | `src/app/components/ModalVerPatron.tsx`        | Modal para visualizar un patrón.                              |
| `ModalRegistro`         | `src/app/components/ModalRegistro.tsx`         | Modal para registro de usuarios.                              |
| `ModalProviderWrapper`  | `src/app/components/ModalProviderWrapper.tsx`  | Wrapper para modales (contexto/proveedor).                    |
| `ModalPoliticas`        | `src/app/components/ModalPoliticas.tsx`        | Modal con políticas/terminos.                                 |
| `ModalIniciarSesion`    | `src/app/components/ModalIniciarSesion.tsx`    | Modal de inicio de sesión.                                    |
| `ModalEliminarCapa`     | `src/app/components/ModalEliminarCapa.tsx`     | Confirmación para eliminar capa.                              |
| `ModalEliminarBobinado` | `src/app/components/ModalEliminarBobinado.tsx` | Confirmación para eliminar bobinado.                          |
| `ModalEditarCapa`       | `src/app/components/ModalEditarCapa.tsx`       | Modal para editar una capa.                                   |
| `ModalEditarBobinado`   | `src/app/components/ModalEditarBobinado.tsx`   | Modal para editar bobinado.                                   |
| `ModalAñadirCapa`       | `src/app/components/ModalAñadirCapa.tsx`       | Modal para añadir capa.                                       |
| `ModalAñadirBobinado`   | `src/app/components/ModalAñadirBobinado.tsx`   | Modal para añadir bobinado.                                   |
| `MobileLayoutWrapper`   | `src/app/components/MobileLayoutWrapper.tsx`   | Layout adaptado para mobile.                                  |
| `MobileAuthTrigger`     | `src/app/components/MobileAuthTrigger.tsx`     | Elemento para abrir auth en mobile.                           |
| `MenuVacio`             | `src/app/components/MenuVacio.tsx`             | Placeholder para menús vacíos.                                |
| `MenuProyecto.tsx`          | `src/app/proyecto/MenuProyecto.tsx`           | Menú para gestión de proyecto.                                |
| `firma`                 | `src/app/components/firma.html`                | Archivo HTML de firma/pie de página.                          |

> Nota: los enlaces arriba son rutas relativas; puedes abrirlos desde el editor.

---

## Páginas (src/app)

| Página    | Ruta                        |
| --------- | --------------------------- |
| Home      | `src/app/page.tsx`          |
| Acerca de | `src/app/acercaDe/page.tsx` |
| Ayuda     | `src/app/ayuda/page.tsx`    |
| Contacto  | `src/app/contacto/page.tsx` |
| Capas     | `src/app/capas/page.tsx`    |
| Proyecto  | `src/app/proyecto/page.tsx` |
| Registro  | `src/app/registro/page.tsx` |
| Sesión    | `src/app/sesion/page.tsx`   |
| Idioma    | `src/app/idioma/page.tsx`   |

---

## API (src/app/api)

| Endpoint      | Ruta                                 | Propósito                          |
| ------------- | ------------------------------------ | ---------------------------------- |
| Auth Login    | `src/app/api/auth/login/route.ts`    | Login con credenciales.            |
| Auth Register | `src/app/api/auth/register/route.ts` | Registro de usuarios.              |
| Auth Logout   | `src/app/api/auth/logout/route.ts`   | Cierre de sesión.                  |
| Auth Session  | `src/app/api/auth/session/route.ts`  | Obtener sesión/estado del usuario. |
| Auth Social   | `src/app/api/auth/social/route.ts`   | Integración social (providers).    |

---

## Callbacks OAuth (src/auth/callback)

| Provider  | Ruta                                   |
| --------- | -------------------------------------- |
| Microsoft | `src/auth/callback/microsoft/route.ts` |
| Google    | `src/auth/callback/google/route.ts`    |
| Facebook  | `src/auth/callback/facebook/route.ts`  |

---

## Contexts (src/context)

| Context       | Ruta                            | Propósito                         |
| ------------- | ------------------------------- | --------------------------------- |
| AuthContext   | `src/context/AuthContext.tsx`   | Gestión estado de sesión/usuario. |
| IdiomaContext | `src/context/IdiomaContext.tsx` | Manejo de idioma/traducciones.    |
| MobileContext | `src/context/MobileContext.tsx` | Estado específico para mobile.    |
| ModalContext  | `src/context/ModalContext.tsx`  | Control de modales globales.      |

---

## Librerías / Utilidades / Tipos

| Archivo      | Ruta                   | Propósito                             |
| ------------ | ---------------------- | ------------------------------------- |
| `auth.ts`    | `src/lib/auth.ts`      | Lógica de autenticación reutilizable. |
| `api.ts`     | `src/lib/api.ts`       | Helpers para llamadas a la API.       |
| `jwt.ts`     | `src/utils/jwt.ts`     | Manejo de tokens JWT.                 |
| `cookies.ts` | `src/utils/cookies.ts` | Helpers para cookies.                 |
| `auth.ts`    | `src/types/auth.ts`    | Tipos TypeScript para autenticación.  |

---
# Diagrama de dependencias (alto nivel)

Este diagrama muestra las relaciones de alto nivel entre páginas, componentes, API, librerías y assets.

```mermaid
flowchart LR
  subgraph APP[Aplicación (src/app)]
    PAGES[Pages (page.tsx...)]
    COMPONENTS[Components]
  end
  PAGES -->|usa| COMPONENTS
  COMPONENTS -->|consume| CONTEXTS[Contexts (Auth, Idioma, Modal, Mobile)]
  PAGES -->|llama| API[API (src/app/api)]
  API -->|usa| LIBS[src/lib/*]
  LIBS -->|usa| UTILS[src/utils/*]
  COMPONENTS -->|usa assets| PUBLIC[public/* (images, icons, patterns)]
  AUTHCB[OAuth Callbacks (src/auth/callback)] -->|interactúa con| API

  classDef smallFont fill:#f8f9fa,stroke:#ddd,color:#333,font-size:12px
  class APP,PAGES,COMPONENTS,API,LIBS,UTILS,CONTEXTS,PUBLIC,AUTHCB smallFont
```

> Si no podés renderizar Mermaid, aquí hay un diagrama ASCII simplificado:

App Pages -> Components -> Contexts
App Pages -> API -> lib -> utils
Components -> public (images/icons)
OAuth Callbacks -> API

---

## 10. Flujo de Autenticación (Login/Registro) 🔐

Sección dedicada a los archivos involucrados en la gestión de usuarios.

### Páginas
-   `src/app/sesion/page.tsx` — Pantalla principal de inicio de sesión.
-   `src/app/registro/page.tsx` — Pantalla de registro de nuevos usuarios.

### Componentes Clave
-   `src/app/components/ModalIniciarSesion.tsx` — Modal con el formulario de login.
-   `src/app/components/ModalRegistro.tsx` — Modal con formulario de registro validado.
-   `src/app/components/BotonSesion.tsx` — Botón en el header que cambia según el estado (Login/Logout/Usuario).
-   `src/app/components/MobileAuthTrigger.tsx` — Disparador de autenticación para vista móvil.
-   `src/app/components/UserBadge.tsx` — Muestra avatar y nombre del usuario logueado.

### Lógica y Estado
-   `src/context/AuthContext.tsx` — Contexto global que mantiene el estado de la sesión (`user`, `login`, `logout`).
-   `src/lib/auth.ts` — Funciones auxiliares y lógica de autenticación.
-   `src/types/auth.ts` — Define interfaces como `User`, `LoginCredentials`, `RegisterData`.

### API & Callbacks
-   `src/app/api/auth/[...nextauth]/route.ts` (o rutas individuales en `api/auth/`) — Endpoints backend.
-   `src/auth/callback/{google,microsoft,facebook}/route.ts` — Rutas para manejar el retorno de proveedores OAuth.
