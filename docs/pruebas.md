# Pruebas del Laboratorio 1

Ejecutadas el 6 de octubre de 2026 con PHP 8.5.11, Microsoft Edge y Playwright 1.62.1. Los 14 grupos automatizados aprobaron. La hora UTC exacta y nombres están en `../evidencias/resultados.json`; `../evidencias/pruebas.pdf` registra esta ejecución. Las capturas usan datos ficticios.

## Diez escenarios mínimos

| Caso | Acción | Resultado comprobado |
| --- | --- | --- |
| 1. Abrir | Entrar a index.php | Cinco secciones, inicio visible, registros y métricas en cero |
| 2. Crear | Producto y campos válidos | PHP valida, aparece BIC-001 y dashboard suma uno |
| 3. Vacío | Enviar sin campos requeridos | Mensajes por campo; no se crea registro |
| 4. Buscar existente | Buscar ana@example.com | Una coincidencia |
| 5. Buscar inexistente | Buscar no-existe o estado sin pedidos | Mensaje sin resultados |
| 6. Editar | Cambiar cantidad, nombre y estado | ID estable; lista, importe y métricas cambian; cancelar conserva original |
| 7. Cancelar eliminación | Rechazar confirmación | El pedido permanece |
| 8. Confirmar eliminación | Aceptar confirmación | Se elimina el ID correcto y se actualizan métricas |
| 9. Recalcular | Cambiar cantidad y retiro/domicilio | Cliente y PHP coinciden en subtotal, impuesto, recargo y total |
| 10. Recargar | Recargar o abrir otra pestaña | Cero registros, carrito vacío y dashboard en cero |

Además: cantidades límite, fechas imposibles/pasadas, tipos incorrectos, catálogo manipulado, productos repetidos, JSON inválido y cuerpo excesivo. El servidor ignora un total falso, no emite cookies y responde Cache-Control: no-store. Un nombre parecido a HTML se muestra literalmente. Un HTTP 503 simulado conserva el borrador; reintentar y enviar dos veces crea una sola solicitud.

## Responsive y navegación

Las cinco secciones se prueban a 320, 375, 768, 1024 y 1280 px. La tabla se desplaza dentro de su región; la página no desborda. Se comprueba acceso por Tab al salto de contenido, navegación y redirecciones desde los cuatro HTML anteriores. No hubo errores inesperados en consola; los 503 son provocados para verificar recuperación.

## Capturas actuales

1. 01-inicio-1280.png: identidad, inicio y temporalidad.
2. 02-catalogo-1280.png: productos y filtros.
3. 03-formulario-y-carrito-1280.png: contacto válido, carrito y totales.
4. 04-solicitudes-creadas-1280.png: registros creados/editados.
5. 05-dashboard-1280.png: métricas coherentes.
6. 06-solicitudes-320.png: listado móvil desplazable.
7. 07-catalogo-768.png: catálogo en tablet.
8. 08-reinicio-tras-recarga-1280.png: reinicio de memoria.

Están en `../evidencias/capturas/`. `docs/evidencias/` es evidencia histórica del prototipo de Semana 1 y no sustituye las pruebas actuales.

## Reproducción y límites

Seguir README: PHP/Apache, npm install, PHP_BIN y npm test. La suite inicia un servidor temporal y lo detiene al terminar. BASE_URL permite usar Apache existente; BROWSER_PATH elige un navegador Chromium. Una nueva ejecución actualiza resultados y capturas, pero no regenera automáticamente el PDF.

Se probó el servidor de desarrollo PHP en Windows. Apache/XAMPP, Safari/Firefox, tecnologías de asistencia y la defensa humana no se ejecutaron durante estas pruebas. Comprobar Apache en el equipo de entrega y ensayar la demostración.
