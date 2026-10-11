# Bicipedia CR - Laboratorio 1

Tienda virtual académica de servicios y accesorios para bicicletas. Permite armar un carrito, crear solicitudes temporales, buscarlas, editarlas y eliminarlas; el dashboard se actualiza con cada operación.

**Curso:** Proyecto de Ingeniería de Software II.
**Profesor:** Erick Eduardo Chaves Vivas.
**Grupo:** 3. **Etapa:** E5, integración.

La propuesta atiende a clientes que seleccionan servicios/accesorios y al personal que revisa las solicitudes durante una demostración. Su operación principal organiza pedidos y sus importes en una sola sesión.

**Integrantes:**

- Carlos Andrés Chavarría Quirós
- Carlos Josue Angúlo Xie
- Marco Vinicio Miranda Miranda
- Michael Aramis Cabrera Hodgson

Repositorio: https://github.com/AlekLapz/bicipedia-semana-1

## Ejecutar con XAMPP

1. Copiar la carpeta del proyecto a `C:\xampp\htdocs\bicipedia`. Si se usa el ZIP de entrega, copiar el contenido de `proyecto/` a esa carpeta.
2. Abrir el panel de XAMPP y arrancar **Apache**.
3. Visitar **http://localhost/bicipedia/index.php**. Si Apache usa otro puerto, agregarlo después de localhost.
4. Agregar productos y completar una solicitud. Mantener la misma pestaña durante el CRUD.

PHP 8.2 o posterior y navegador actual con JavaScript habilitado. No hay dependencias de ejecución ni compilación. No se necesita iniciar MySQL. Un servidor Python o GitHub Pages no ejecuta la validación PHP; abrir los archivos con doble clic tampoco permite probar el flujo completo.

Alternativa de desarrollo, desde la carpeta del proyecto:

```powershell
& 'C:\xampp\php\php.exe' -S 127.0.0.1:8080 -t .
```

Visitar http://127.0.0.1:8080/index.php; detener con Ctrl+C. Servidor solo para desarrollo local.

## Cinco secciones

| Sección | Comportamiento |
| --- | --- |
| Inicio | Identidad, proceso y aviso de temporalidad |
| Catálogo | Cuatro productos precargados; búsqueda, categoría y altas al carrito |
| Solicitud | Cantidades, retiro/domicilio, cálculo y formulario de creación/edición |
| Solicitudes | Listado dinámico, búsqueda, filtro, estados, edición y eliminación confirmada |
| Dashboard | Conteos e importe total calculados desde los registros actuales |

Se usa `index.php` con navegación por anclas para conservar el mismo arreglo JavaScript entre secciones. Los cuatro HTML de Semana 1 redirigen a la sección correspondiente.

## Funciones implementadas

- Crear tras validar en JavaScript y PHP; IDs consecutivos como BIC-001.
- Consultar por código, cliente, correo o producto; filtrar por estado y mostrar estados vacíos.
- Editar conservando el ID; cancelar sin modificar el original y cambiar el estado.
- Eliminar después de confirmar; cancelar conserva el registro.
- Carrito con cantidades enteras de 1 a 20, eliminación de líneas y vaciado confirmado.
- Calcular subtotal, impuesto simulado del 13 %, recolección ficticia de ₡2.500 cuando corresponde y total; recalcular al modificar carrito y solicitudes.
- Rechazar campos inválidos, fechas pasadas/imposibles y cantidades/productos manipulados. PHP calcula desde sus precios, ignorando importes enviados por el cliente.
- Conservar el borrador ante fallos de PHP y evitar el envío doble.
- HTML semántico, etiquetas y mensajes accesibles, Flexbox/Grid y tabla desplazable con teclado.

Precios, impuesto y recargo son valores de demostración; no representan una cotización, factura ni operación comercial real.

## Datos temporales

`estado.solicitudes` y `estado.carrito`, en `js/app.js`, viven exclusivamente en memoria JavaScript. Cambiar entre secciones conserva los datos. **Recargar, cerrar o abrir otra pestaña empieza con cero solicitudes y el carrito vacío.**

PHP recibe POST, valida, calcula con su catálogo y devuelve JSON. No guarda registros. No se usan base de datos, sesiones, cookies de aplicación, archivos de registros, localStorage, sessionStorage, IndexedDB ni servicios externos. Los JSON del repositorio contienen configuración o resultados de pruebas, no solicitudes persistidas.

## Estructura

```text
index.php                  Cinco secciones semánticas
index.html y otros HTML    Entradas de compatibilidad con Semana 1
css/styles.css             Estilos y adaptación a pantallas
js/datos-iniciales.js       Catálogo, estados y cálculo en céntimos
js/validaciones.js          Validación del formulario en cliente
js/app.js                  Estado, DOM, CRUD, eventos y POST
php/catalogo.php           Catálogo estático de servidor
php/validar.php            Validación y respuesta JSON sin persistencia
assets/images/             Ilustración local
docs/                      Decisiones, verificación y guía de defensa
evidencias/capturas/        Ocho capturas actuales
evidencias/pruebas.pdf      Informe de pruebas
evidencias/resultados.json Resultado automatizado
tests/laboratorio.mjs      Pruebas opcionales PHP y navegador
```

`docs/evidencias/` conserva evidencia histórica de Semana 1; las pruebas actuales están en `evidencias/`.

## Pruebas

Se aprobaron **14 grupos de pruebas** con PHP 8.5.11 y Microsoft Edge mediante Playwright: CRUD, validación cliente/servidor, cálculos, manipulación de entradas, texto seguro, fallos HTTP, doble envío, navegación y reinicio de memoria. Las cinco secciones se comprobaron a **320, 375, 768, 1024 y 1280 px**. Se probó el servidor de desarrollo PHP; la ejecución bajo Apache/XAMPP queda para verificar en los equipos del grupo.

Pruebas opcionales: Node 20 o posterior, PHP y Edge:

```powershell
npm install
$env:PHP_BIN='C:\xampp\php\php.exe'
npm test
```

Si no se dispone de Edge, configurar BROWSER_PATH con el ejecutable Chromium/Chrome. BASE_URL permite probar un servidor ya iniciado, por ejemplo http://localhost/bicipedia. La suite sustituye capturas y resultados; el informe PDF corresponde a la ejecución registrada en él.

Ver [detalle y diez casos mínimos](docs/pruebas.md), [verificación de requisitos](docs/lista-verificacion.md), [decisiones](docs/decisiones.md) y [guía de defensa](docs/defensa.md).

Para estudiar desde cero, consultar [guía explicada paso a paso](docs/guia-defensa.md), disponible también en [Word](docs/Guia_Defensa_Bicipedia_Grupo03.docx) y [PDF](docs/Guia_Defensa_Bicipedia_Grupo03.pdf). La [revisión del 10 de octubre](docs/revision-alcance.md) compara requisitos, opciones permitidas y límites, con 14 grupos de pruebas nuevamente aprobados. La aplicación del laboratorio está en la rama `codex/laboratorio-1-bicipedia` mientras el PR 1 no se integre a main.

## Entrega y pendientes

`GRUPO03_BICIPEDIA_E5.zip` organiza `proyecto/`, `evidencias/capturas/`, `evidencias/pruebas.pdf` y este README en la raíz. Excluye .git, dependencias, instaladores y documentos originales del profesor.

El alcance funcional está implementado. El grupo debe comprobar su XAMPP, ensayar la defensa y completar los aportes reales de cada integrante en `docs/defensa.md`. La distribución incluida es una propuesta, no una afirmación de trabajo realizado. El correo aportado ubica la defensa del Grupo 3 el 12 de octubre de 2026 a las 6:00 p. m.; confirmar cualquier actualización del docente.

## Fuentes del alcance

`Laboratorio 1.pdf` y el mensaje del docente aportados por el usuario definen requisitos y entrega. Los materiales de Semana 1, TaskFlow y PHP orientan conceptos y ejecución local. Bicipedia se conserva como identidad y se adapta al dominio permitido de **tienda virtual**. Java no se incorpora porque no es exigido por este laboratorio.
