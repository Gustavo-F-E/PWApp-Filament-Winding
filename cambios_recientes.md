# Resumen de Cambios Recientes - Botones de Sesión y Registro

Este documento resume los cambios realizados recientemente en la navegación y el sistema de sesiones, los cuales podrían estar afectando la funcionalidad de los botones de **Iniciar Sesión** y **Registro**.

## 1. Implementación del `MobileLayoutWrapper`
Recientemente se refactorizó la estructura móvil para incluir un "drawer" (menú desplegable) global y un sistema de menús laterales en horizontal.
- **Antes**: Los botones probablemente estaban en un menú simple o directamente en el layout.
- **Ahora**: Están contenidos dentro del `GLOBAL NAV DRAWER` en `MobileLayoutWrapper.tsx`.

## 2. Cambio a Componentes de Next.js (`Link`)
Se estandarizó el uso de `<Link />` de `next/link` para la navegación.
- **Consecuencia**: La navegación ahora es manejada por el cliente de Next.js. Si algo está bloqueando el evento de clic (como un backdrop con un z-index incorrecto), el enlace no se activará.

## 3. Lógica de Cierre Automático
Se añadió un `useEffect` que escucha cambios en la ruta (`pathname`):
```tsx
React.useEffect(() => {
  closeGlobalNav();
  closePageMenu();
}, [pathname]);
```
- **Propósito**: Asegurar que los menús se cierren al navegar.
- **Posible problema**: Si la navegación no llega a dispararse porque el clic es interceptado, el menú permanece abierto y da la sensación de que el botón no funciona.

## 4. Estructura de Capas (Z-Index) y Backdrops
Se introdujeron fondos oscuros (backdrops) para los menús móviles:
- El backdrop tiene un `z-index: 60`.
- El contenido del menú también está en esa capa o superior.
- **Conflicto identificado**: En el modo retrato, el botón de menú ("hamburguesa") y el fondo comparten el mismo `z-index`, lo que podría causar que el fondo bloquee interacciones si no se gestiona el orden de apilamiento cuidadosamente.

## 5. Prevención de Propagación
Se añadió `e.stopPropagation()` en el contenedor del menú para evitar que al hacer clic dentro del menú este se cierre (ya que el fondo tiene un evento de cierre).
- **Riesgo**: Aunque es necesario, si se aplica incorrectamente o si hay elementos superpuestos con `pointer-events: none` parcial, puede interferir con la detección de clics en los enlaces.

---

### Diagnóstico de por qué "ahora no funcionan":
Es muy probable que la **superposición de capas (z-index)** o el **backdrop invisible** esté capturando los clics antes de que lleguen a los botones de `BotonSesion`. Específicamente, en `MobileLayoutWrapper.tsx`, el `div` que hace de fondo podría estar cubriendo el contenido del menú si el contenedor interno no tiene un posicionamiento que lo fuerce por encima.

### Soluciones Aplicadas:

1. **Corrección de Redirecciones (Middleware)**:
   - Se eliminó la lógica que redirigía forzosamente de `/sesion` y `/registro` al Home si existía una cookie de sesión. Esto permite acceder a estas páginas incluso si hay una sesión previa o mal cerrada.

2. **Refuerzo de Cierre de Sesión (Logout)**:
   - Se actualizó `AuthContext.tsx` para asegurar que la cookie `auth_token` se elimine correctamente especificando el `path=/` y los atributos de seguridad.

3. **Corrección de Interactividad (Z-Index)**:
   - En `MobileLayoutWrapper.tsx`, se separó el fondo oscuro (backdrop) del contenido del menú.
   - Se asignó un `z-index: 70` al contenido del menú y `z-index: 60` al fondo, asegurando que el fondo no intercepte los clics destinados a los botones.
   - Se añadió `pointer-events-none` al fondo cuando está oculto para evitar bloqueos invisibles.

Estas modificaciones aseguran que tanto el acceso directo por URL como el uso de los botones en la interfaz móvil funcionen correctamente.
