# Guía de defensa - Bicipedia, Grupo 3

## Demostración

1. Iniciar Apache y abrir localhost/bicipedia/index.php. Mostrar identidad, cinco secciones y temporalidad.
2. Agregar mantenimiento y crear BIC-001 con datos ficticios. Mostrar POST y respuesta JSON en Network.
3. Crear BIC-002 con kit y domicilio. Explicar subtotal, impuesto simulado, recargo y total.
4. Buscar BIC-001 o correo; editar cantidad y estado. Mostrar mismo ID y dashboard actualizado.
5. Eliminar BIC-002: cancelar para mostrar que permanece y después confirmar.
6. Recargar: registros, carrito y métricas vuelven a cero. Explicar por qué lo exige el laboratorio.

## Explicar el código

- `estado` en js/app.js guarda arreglos de la pestaña. Las anclas cambian visibilidad sin recargar.
- `crearSolicitud` genera ID; `buscarSolicitud` usa find; `editarSolicitud` map; `eliminarSolicitud` confirma y usa filter.
- `cargarEdicion` copia ítems al carrito. Hasta confirmar con PHP, el original está intacto. Cancelar limpia el borrador.
- `renderizarSolicitudes` filtra y crea nodos; `renderizarDashboard` usa filter/reduce. textContent muestra texto del usuario sin ejecutarlo como HTML.
- `calcularTotales` trabaja en céntimos. PHP usa su catálogo y recalcula: los precios del navegador pueden manipularse.
- `validarPedido` mejora la experiencia. PHP repite comprobaciones; 422 significa campos inválidos. Responder correctamente no guarda registros en servidor.
- `procesarFormulario` usa fetch/POST, bloqueo y timeout. Si falla conserva el carrito; solo crea/actualiza cuando PHP confirma.
- CSS usa Flexbox/Grid. La tabla mantiene ancho legible en móvil mediante desplazamiento local enfocable.

## Reparto sugerido para preparar la exposición

Esta propuesta es para ensayar; no acredita aportes realizados. Ajustarla con la experiencia real del grupo.

| Integrante | Tema sugerido |
| --- | --- |
| Carlos Andrés Chavarría Quirós | Contexto Bicipedia, alcance y recorrido |
| Carlos Josue Angúlo Xie | HTML, CSS responsive y accesibilidad |
| Marco Vinicio Miranda Miranda | Arreglos, carrito, CRUD y DOM |
| Michael Aramis Cabrera Hodgson | PHP, cálculos y pruebas |

Todos deben explicar el flujo completo y realizar un cambio sencillo en vivo.

## Registro de aportes reales por completar

| Integrante | Trabajo realizado y evidencia |
| --- | --- |
| Carlos Andrés Chavarría Quirós | Pendiente de completar por el integrante |
| Carlos Josue Angúlo Xie | Pendiente de completar por el integrante |
| Marco Vinicio Miranda Miranda | Pendiente de completar por el integrante |
| Michael Aramis Cabrera Hodgson | Pendiente de completar por el integrante |

## Posibles cambios en vivo

- Cambiar un precio en ambos catálogos y comprobar coincidencia JavaScript/PHP.
- Agregar un filtro al arreglo de solicitudes.
- Ajustar CSS y comparar móvil/escritorio.
- Explicar actualización de conteos y reinicio al recargar.
