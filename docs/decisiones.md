# Cinco decisiones de diseño

## 1. Regiones semánticas y tarjetas independientes

**Qué:** cada vista utiliza `header`, `nav`, `main`, `section` y `footer`, con un solo `h1`. Los servicios y las cuatro métricas son `article`. La información complementaria utiliza `aside`.

**Por qué:** `nav` identifica un bloque de navegación para el navegador y las tecnologías de asistencia; un `div` solo agruparía elementos sin expresar ese significado. Cada tarjeta del dashboard se entiende de manera independiente. Los encabezados describen la jerarquía del contenido.

**Requisito:** HTML semántico, inicio y dashboard (apartados 6, 9 y 12).

## 2. Mobile First con Flexbox y Grid

**Qué:** el CSS base presenta una columna. Las media queries de `min-width: 48rem` y `64rem` amplían el dashboard a dos y cuatro columnas. La navegación utiliza Flexbox con `flex-wrap`. El contenedor limita el contenido a `72rem` y la imagen conserva su proporción.

**Por qué:** la navegación permanece visible en móvil sin necesitar un menú programado. Grid reorganiza las tarjetas según el espacio disponible. `border-box` incluye padding y borde en el ancho y simplifica el cálculo del modelo de caja.

**Requisito:** Box Model, Flexbox, Grid y comprobación entre 320 y 1280 px (apartados 10 y 11).

## 3. Ocho controles con etiquetas visibles

**Qué:** nombre, apellido, correo, teléfono, servicio, fecha, comentarios y aceptación. Todos tienen `id`, `name` y un `label` asociado. Se utilizan dos grupos `fieldset`/`legend`, `autocomplete` para datos personales y tipos nativos. Nombre, apellido, correo, servicio y aceptación son obligatorios. Los otros tres campos se identifican como opcionales.

**Por qué:** el formulario conserva los ocho controles de la tarea. El negocio contextualiza la categoría como tipo de servicio; los comentarios permiten describir la bicicleta. No se añaden campos de dirección, agenda o rutas. El placeholder es únicamente un ejemplo de formato. El botón de acción no cuenta como control de información.

**Requisito:** formulario accesible de ocho controles (apartado 8). El pequeño script opcional cancela el envío para demostrar la validación nativa sin persistencia. No agrega lógica de gestión de solicitudes.

## 4. Tabla semántica dentro de una región desplazable

**Qué:** cinco registros ficticios con cinco columnas, `caption`, `thead`, `tbody`, `th scope="col"` y `th scope="row"`. En móvil, la región de la tabla admite foco y desplazamiento horizontal con teclado. Los estados incluyen texto.

**Por qué:** los encabezados conservan la relación con sus celdas y los datos siguen siendo legibles. Solo se desplaza la tabla, sin ensanchar la página. La tabla representa información; Flexbox y Grid resuelven la maquetación.

**Requisito:** listado accesible y consultable en móvil (apartados 7, 11 y 12).

## 5. Foco visible y recorrido de teclado

**Qué:** estilos `:hover`, `:focus` y `:focus-visible`; contorno azul de tres píxeles para teclado, enlace de salto al contenido y `aria-current="page"` en la navegación. La ayuda de comentarios se asocia mediante `aria-describedby`. Tras una prueba válida, el mensaje recibe foco.

**Por qué:** se puede identificar la ubicación del foco, evitar la navegación repetida y comprender el resultado de la acción. Se conserva el comportamiento de los controles nativos y no se utilizan valores positivos de `tabindex`.

**Requisito:** accesibilidad, estados interactivos y prueba mediante teclado (apartados 10 y 12).
