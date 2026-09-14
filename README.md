# Bicipedia CR - Semana 1

Prototipo estático de servicios técnicos de bicicletas y solicitudes de recolección y entrega a domicilio.

**Curso:** Proyecto de Ingeniería de Software II.  
**Profesor:** ERICK EDUARDO CHAVES VIVAS.  
**Integrantes:** Carlos Andrés Chavarría Quirós; Carlos Josue Angúlo Xie; Marco Vinicio Miranda Miranda.  
**Autor Git:** Carlos Andres Chavarria Quiros.

## Alcance

Cuatro vistas de la Tarea Semana 1: inicio, listado de cinco solicitudes ficticias, formulario de ocho controles y dashboard de cuatro métricas. La propuesta de Bicipedia aporta el contexto del negocio. No se implementan backend, base de datos ni autenticación.

## Ejecución

Abrir una terminal en esta carpeta y ejecutar `py -m http.server 8080`. Visitar http://localhost:8080. Detener con Ctrl+C. También se puede abrir `index.html` directamente.

## Vistas

- `index.html`: presentación y proceso a domicilio.
- `listado.html`: tabla semántica de cinco solicitudes.
- `formulario.html`: ocho controles con validación nativa.
- `dashboard.html`: cuatro métricas estáticas coherentes con el listado.

## Tecnologías

HTML5, CSS3 y un script mínimo que evita el envío del formulario de demostración. No se requieren dependencias ni compilación.

Repositorio: https://github.com/AlekLapz/bicipedia-semana-1

## Problema que representa

Bicipedia CR necesita explicar sus servicios y ordenar el primer contacto para coordinar la recolección y entrega de bicicletas a domicilio. Este incremento representa la interfaz inicial de ese proceso con datos ficticios. La caja, facturación, inventario y base de clientes existentes quedan fuera del prototipo.

## Estructura

```text
chavarria-carlos-semana-1/
├── index.html
├── listado.html
├── formulario.html
├── dashboard.html
├── css/styles.css
├── js/formulario.js
├── assets/
│   ├── images/bicicleta.svg
│   ├── audio/.gitkeep
│   └── video/.gitkeep
├── docs/
│   ├── decisiones.md
│   ├── pruebas.md
│   ├── lista-verificacion.md
│   └── evidencias/
├── .gitignore
└── README.md
```

Las carpetas de audio y video se conservan vacías para respetar la estructura requerida; la tarea no exige contenido multimedia. La ilustración SVG local representa puntos de revisión de una bicicleta y no requiere descargas externas.

## Resumen de cinco decisiones

1. Regiones semánticas y tarjetas `article` para comunicar el propósito del contenido.
2. Mobile First, navegación Flexbox y dashboard Grid de una, dos o cuatro columnas.
3. Ocho controles nativos con etiquetas visibles y agrupación `fieldset`/`legend`.
4. Tabla semántica dentro de una región desplazable mediante teclado.
5. Foco visible, salto al contenido y ayudas asociadas a los controles.

La justificación y el requisito que satisface cada decisión están en [docs/decisiones.md](docs/decisiones.md).

## Comportamiento del formulario

Nombre, apellido, correo, servicio y aceptación son obligatorios. Teléfono, fecha y comentarios son opcionales, como permite la guía. Los comentarios pueden describir la bicicleta, el problema, la zona y el horario preferido usando datos ficticios.

El botón **Probar solicitud** usa la validación HTML del navegador. Un script de nueve líneas cancela el envío y enfoca un mensaje que confirma únicamente la validación. No se guardan datos, no se modifica el listado y no se calculan métricas. Sin JavaScript, la navegación funciona y el botón permanece deshabilitado con una explicación visible.

## Pruebas y evidencias

- [Registro de pruebas](docs/pruebas.md) y [lista de verificación](docs/lista-verificacion.md).
- [Inicio a 320 px](docs/evidencias/index-320.png), [375 px](docs/evidencias/index-375.png), [768 px](docs/evidencias/index-768.png) y [1280 px](docs/evidencias/index-1280.png).
- [Formulario recorrido mediante teclado](docs/evidencias/formulario-foco-teclado.png).
- [Resultado de validación](docs/evidencias/formulario-validado.png).
- [DevTools: Box Model](docs/evidencias/devtools-box-model.png), [cambio temporal en Styles](docs/evidencias/devtools-cambio-temporal.png) y [regla ganadora en Computed](docs/evidencias/devtools-regla-display.png).
- [Resultados de las comprobaciones](docs/evidencias/comprobaciones.json) y [contrastes medidos](docs/evidencias/contraste.json).
- [Historial de cuatro commits](docs/evidencias/historial-commits.png) y [salida original de Git](docs/evidencias/historial-commits.txt).

Se comprobaron las cuatro vistas en 320, 375, 768, 1024 y 1280 px, la navegación mediante teclado, la estructura de tabla y formulario, la validación nativa y la consola. Las capturas de página completa conservan el ancho de prueba; su altura puede superar la del viewport.

## Versionado y entrega

El repositorio contiene cuatro incrementos: estructura, responsive, accesibilidad y documentación. Todos utilizan la identidad Git de Carlos y los mensajes proporcionados por el usuario. Consultar `git log --oneline` y `git status` para verificar el historial y el estado actual.

La captura del historial muestra autores y mensajes obtenidos directamente de `git log`; omite los hashes para poder incorporar la evidencia al mismo cuarto commit sin invalidar la captura. El ZIP `chavarria-carlos-semana-1.zip` incluye la carpeta completa del proyecto, sus fuentes, documentación y evidencias. El historial Git se consulta en el repositorio enlazado, por lo que la carpeta interna `.git` no se incluye en el ZIP.

El nombre de la carpeta y del ZIP utiliza el apellido y nombre de Carlos para seguir `apellido-nombre-semana-1`; los tres integrantes se identifican al comienzo de este README.

## Fuentes de los requisitos

- `Tarea_Semana_1.pdf`, proporcionado por el usuario: define el alcance evaluado.
- Propuesta de prefactibilidad de Bicipedia CR, proporcionada como `pasted-text.txt`: orienta únicamente el contexto del negocio.

No se implementan los módulos futuros de la propuesta final ni se afirman horarios, cobertura o costos reales del negocio.
