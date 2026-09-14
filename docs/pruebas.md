# Registro de pruebas

Fecha: 14 de septiembre de 2026. Entorno: Microsoft Edge/Chromium, servidor HTTP local y automatización con Playwright. Los archivos PNG son capturas del navegador. Las evidencias de DevTools proceden de su interfaz real conectada al sitio local.

## 1. Navegación mediante teclado

**Resultado: aprobada.** Se recorrió la navegación de las cuatro vistas con Tab y Shift+Tab y se activaron enlaces con Enter. El primer Tab muestra el enlace de salto; Enter mueve el foco al contenido. El contorno calculado es de 3 px. En el formulario se accedió a los ocho controles, se eligió el servicio con flecha abajo, se marcó la aceptación con Espacio y se activó el botón con Enter. El control de fecha incluye las paradas propias del navegador. La validación final recibe el foco.

Evidencias: [comprobaciones.json](evidencias/comprobaciones.json), [foco del formulario](evidencias/formulario-foco-teclado.png) y [resultado](evidencias/formulario-validado.png).

## 2. Vista de 320 px y responsive

**Resultado: aprobada.** Las cuatro vistas se comprobaron en 320×568, 375×667, 768×1024, 1024×768 y 1280×900: veinte combinaciones. El ancho del documento no supera el viewport. La navegación permanece visible. El dashboard presenta una columna a 320 y 375, dos a 768 y cuatro a 1024 y 1280 px.

Evidencias: [inicio a 320 px](evidencias/index-320.png), [375 px](evidencias/index-375.png), [768 px](evidencias/index-768.png), [1280 px](evidencias/index-1280.png), capturas equivalentes de las otras vistas a 320 y 1280 px, y `responsive` en [comprobaciones.json](evidencias/comprobaciones.json).

Las capturas completas conservan el ancho del viewport y pueden tener mayor altura para mostrar todo el contenido. Son emulaciones de viewport; no representan pruebas en dispositivos físicos.

## 3. Formulario de ocho controles

**Resultado: aprobada.** Se contaron exactamente ocho controles de información con `id`, `name` y una etiqueta visible asociada. El formulario vacío bloquea el envío y enfoca nombre. Un correo sin formato válido produce `typeMismatch`. Con datos ficticios válidos y aceptación marcada, el resultado aparece sin solicitudes de red y sin cambiar la URL. El código no utiliza almacenamiento.

El teléfono, la fecha y los comentarios son opcionales. Los otros cinco controles son obligatorios. El botón es de tipo `submit` y no se cuenta entre los ocho controles de información.

Evidencias: sección `form` en [comprobaciones.json](evidencias/comprobaciones.json) y [formulario validado](evidencias/formulario-validado.png).

## 4. Tabla accesible

**Resultado: aprobada mediante inspección estructural y teclado.** La tabla tiene `caption`, `thead`, `tbody`, cinco columnas y cinco registros. Sus encabezados usan `scope="col"` y `scope="row"`. La región desplazable admite foco y se verificó que flecha derecha aumenta su desplazamiento a 320 px. Los estados se expresan con texto y color. La tabla no se utiliza para maquetar.

Evidencias: sección `table` en [comprobaciones.json](evidencias/comprobaciones.json), [tabla móvil](evidencias/listado-320.png) y [tabla de escritorio](evidencias/listado-1280.png). No se realizó una prueba con lector de pantalla.

## 5. Consola del navegador

**Resultado: aprobada.** Se registraron los eventos `console.error` y `pageerror` durante la comprobación final. El arreglo `errors` contiene cero errores.

Evidencia: [comprobaciones.json](evidencias/comprobaciones.json).

## 6. Enlaces entre vistas

**Resultado: aprobada.** Las cuatro páginas respondieron HTTP 200. Desde cada vista se comprobaron sus cuatro enlaces de navegación, también con respuesta HTTP 200, y se activaron enlaces mediante Enter. Cada página identifica el enlace actual mediante `aria-current="page"`.

Evidencia: secciones `semantics` y `keyboard` en [comprobaciones.json](evidencias/comprobaciones.json).

## 7. Imagen responsive

**Resultado: aprobada.** La ilustración SVG local se carga, tiene texto alternativo informativo y no desborda en ninguno de los cinco anchos. `max-width: 100%` y `height: auto` mantienen su proporción. No depende de servicios externos.

Evidencias: sección `responsive` en [comprobaciones.json](evidencias/comprobaciones.json) y capturas de inicio.

## 8. Semántica y contraste

**Resultado: aprobada en las comprobaciones realizadas.** Las cuatro vistas tienen doctype HTML, idioma español, UTF-8, viewport, título descriptivo, regiones semánticas y un solo `h1`. Los encabezados mantienen su jerarquía. Se midieron estos pares: texto principal/fondo 11,20:1; texto secundario/fondo 6,19:1; texto del botón/fondo 6,34:1; contorno de foco/fondo 6,43:1.

Evidencias: [comprobaciones.json](evidencias/comprobaciones.json) y [contraste.json](evidencias/contraste.json). Estas pruebas no equivalen a una certificación integral de accesibilidad.

## 9. Box Model en DevTools

**Resultado: aprobada.** En Elements se seleccionó la segunda tarjeta `.metric-card` del dashboard y se abrió Computed. A 1280 px, el diagrama muestra contenido de 226 px de ancho, padding de 24 px por lado, borde de 1 px y margen de 0. El ancho exterior es 276 px: 226 + 48 + 2. La propiedad `box-sizing` es `border-box`.

Evidencia: [captura auténtica de Computed / Box Model](evidencias/devtools-box-model.png). La interfaz de DevTools se abrió en una pestaña independiente conectada al navegador de prueba.

## 10. Cambio temporal desde Styles

**Resultado: aprobada.** Desde el editor de declaraciones de Styles se añadió `background-color: #f2db9d` a `element.style` de la segunda tarjeta. Su color calculado cambió de blanco a `rgb(242, 219, 157)`. Al recargar el dashboard volvió a `rgb(255, 255, 255)`: el cambio existía únicamente en memoria y no modificó `css/styles.css` ni el HTML guardado.

Evidencias: [panel Styles con la declaración temporal](evidencias/devtools-cambio-temporal.png), [tarjeta con el cambio](evidencias/dashboard-cambio-temporal.png) y [tarjeta después de recargar](evidencias/dashboard-tras-recarga.png).

## 11. Regla ganadora de display

**Resultado: aprobada.** En Computed se filtró `display` para el contenedor del dashboard y se expandió la propiedad. La declaración ganadora es `display: grid` del selector agrupado `.service-grid, .dashboard-grid, .form-grid`, en `css/styles.css:67`; prevalece sobre el `display: block` del navegador. También se verificó que `.site-nav ul` establece `display: flex`. Las media queries cambian el número de columnas.

Evidencias: [Computed con regla ganadora y archivo de origen](evidencias/devtools-regla-display.png) y sección `display` en [comprobaciones.json](evidencias/comprobaciones.json).

## 12. Sin JavaScript

**Resultado: aprobada.** La navegación a las cuatro vistas permanece disponible. El botón del formulario permanece deshabilitado y `noscript` explica cómo probar la validación. No se produce un envío accidental del formulario.

## 13. Git y formato de entrega

**Resultado: aprobada.** El historial contiene cuatro incrementos de estructura, diseño responsive, accesibilidad y documentación, todos bajo la identidad del usuario y con los mensajes que proporcionó. Se revisó el estado de Git y se generó el ZIP de la carpeta completa. La comprobación del archivo comprimido verificó su integridad y comparó cada archivo con su fuente; también se comprobaron los enlaces locales de la documentación.

Evidencias: [captura del historial](evidencias/historial-commits.png) y [salida original](evidencias/historial-commits.txt). La captura presenta autores y mensajes reales de `git log -4 --format="%an <%ae>%n%s%n"`. No simula una terminal ni incluye hashes que cambiarían al incorporar la propia evidencia al cuarto commit. El historial completo se encuentra en el [repositorio de GitHub](https://github.com/AlekLapz/bicipedia-semana-1).
