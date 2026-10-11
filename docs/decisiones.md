# Decisiones del Laboratorio 1

1. **Tienda virtual de bicicletas.** Se mantiene Bicipedia y se agrega un accesorio a sus servicios para desarrollar el dominio permitido de tienda virtual. Todos los importes son ficticios.
2. **Cinco secciones en un documento.** Las anclas muestran una sección a la vez. Cargar documentos diferentes reiniciaría la memoria e impediría recorrer el CRUD sin almacenamiento.
3. **Un estado de aplicación.** `estado` contiene solicitudes, carrito, ID de edición y contador. Cada render obtiene datos de esos arreglos. Se clonan ítems al editar; cancelar conserva el original.
4. **Dinero en céntimos enteros.** Se redondea el impuesto simulado una vez por pedido. PHP recalcula con precios propios. Las pruebas comparan ambos catálogos.
5. **POST sin persistencia.** PHP rechaza tipos, fechas, cantidades y productos inválidos; responde JSON con 200, 422, 405 o 413. Solo una respuesta correcta se incorpora al arreglo del navegador. La respuesta usa no-store.
6. **Validación recuperable.** Resumen enfocado y mensajes por campo, actualizados al corregir. Un fallo del servidor conserva el carrito. Se bloquean mutaciones durante POST para evitar carreras y envío doble.
7. **DOM seguro y accesible.** `textContent` muestra datos personales sin interpretarlos como HTML. Etiquetas, fieldsets, caption, encabezados, regiones de estado, foco de navegación y salto al contenido.
8. **Flexbox y Grid.** Controles y tarjetas pasan de una a varias columnas. La tabla conserva anchuras legibles y desplazamiento local enfocable; la página no desborda entre 320 y 1280 px.

Los módulos JavaScript son nativos. Playwright es una dependencia opcional de pruebas y no participa en la ejecución del sitio.
