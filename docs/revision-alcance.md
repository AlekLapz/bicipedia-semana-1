# Revisión de alcance del Laboratorio 1

Revisión del 10 de octubre de 2026. Código funcional: `0ceddcbea6c41a44d0969d7faaaf0c3300674f7d`, rama `codex/laboratorio-1-bicipedia`. El PR 1 continúa en borrador y main conserva Semana 1 al momento de la revisión.

## Resultado

Los requisitos funcionales del Laboratorio 1 están implementados. Se repitieron los 14 grupos de pruebas y todos aprobaron. No se añadieron ni modificaron funciones de la aplicación para esta revisión. Se incorporó documentación de aprendizaje y defensa.

La comprobación directa con Apache/XAMPP queda pendiente en el equipo del grupo, porque ese entorno no está instalado aquí. Se usó PHP 8.5.11 con su servidor local y Edge/Playwright. La defensa humana y la atribución de aportes individuales tampoco se sustituyen con pruebas automáticas.

## Obligatorio implementado

Cinco secciones; identidad y dominio permitido de tienda virtual; HTML semántico; CSS externo con Flexbox/Grid; catálogo inicial; registros en arreglo JavaScript; crear/listar/buscar/editar/eliminar; confirmación de eliminación; validación; totales; estados vacíos; POST PHP sin persistencia; reinicio por recarga; documentación, capturas y ZIP. Ver tabla de trazabilidad en `guia-defensa.md`.

## Opcional permitido y decisiones de la propuesta

Filtro por categoría, carrito vacío y vaciar carrito aparecen como opciones de tienda virtual en la página 3. Los nombres, campos y estilo pueden personalizarse según la página 5. Servicios/accesorios de bicicleta, estados, fecha, modalidad, tasas ficticias y límites de cantidad son decisiones de Bicipedia y no exigencias literales del profesor.

Bloqueo de envío, timeout, errores HTTP y textContent son apoyo técnico al flujo y validación existentes. No equivalen a cifrado ni a nuevos módulos comerciales. Playwright automatiza pruebas y no es un framework de la aplicación.

## Fuera del alcance y ausente

Sin cifrado, autenticación, contraseñas, roles, pagos, facturación, inventario real, base de datos, escritura de pedidos en archivos, sesiones PHP, almacenamiento del navegador o servicios externos. La única petición de la aplicación es a `php/validar.php`, local al proyecto.

Los ejemplos de clase que enseñan LocalStorage, sesiones, SQL o APIs externas no se trasladan al laboratorio: la página 2 los prohíbe. No se integra el ejemplo de Java/Maven a la aplicación web, pues el laboratorio no lo exige.

## Evidencia actual

`revision-2026-10-10.json` conserva solo los resultados de las pruebas. El registro de esta nueva ejecución está separado de las capturas e informe del 6 de octubre, para no atribuir al informe antiguo una ejecución distinta. Las pruebas cubren las cinco secciones en 320, 375, 768, 1024 y 1280 px; no hubo errores inesperados de consola.

## Antes de entregar

Comprobar Apache en localhost, practicar el recorrido de la página 11 del enunciado y completar los aportes reales. Revisar la rama correcta al descargar. El número de grupo y los cuatro nombres están incluidos en la guía, sin inventar autorías individuales.
