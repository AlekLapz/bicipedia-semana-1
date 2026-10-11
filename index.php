<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Bicipedia CR: catálogo académico y solicitudes temporales de servicios y accesorios para bicicletas.">
  <title>Bicipedia CR · Servicios y pedidos</title>
  <link rel="icon" href="assets/images/bicicleta.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <script type="module" src="js/app.js"></script>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido principal</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#inicio">bicipedia<span>CR / SERVICIO DE BICICLETAS</span></a>
      <nav class="site-nav" aria-label="Navegación principal">
        <ul>
          <li><a href="#inicio" aria-current="page">Inicio</a></li>
          <li><a href="#servicios">Catálogo</a></li>
          <li><a href="#solicitud">Nuevo pedido <span id="contador-carrito" class="nav-count">0</span></a></li>
          <li><a href="#solicitudes">Solicitudes</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="container session-banner"><span class="session-dot" aria-hidden="true"></span><p>Demostración temporal: tus pedidos desaparecen al recargar o cerrar esta pestaña.</p></div>
  <noscript><p class="notice container">Activá JavaScript para navegar, gestionar el carrito y crear solicitudes temporales.</p></noscript>
  <main id="contenido" class="container" tabindex="-1">
    <p id="mensaje-global" class="notice app-message" role="status" aria-live="polite" aria-atomic="true" hidden></p>

    <section id="inicio" data-seccion aria-labelledby="titulo-inicio">
      <div class="hero">
        <div>
          <p class="eyebrow">DEL TALLER A TU PRÓXIMA RUTA</p>
          <h1 id="titulo-inicio" tabindex="-1">Tu bicicleta,<br>en buenas manos.</h1>
          <p class="lead">Elegí servicios y accesorios, armá tu pedido y coordiná una recolección o retiro de prueba.</p>
          <div class="actions"><a class="button" href="#servicios">Explorar el catálogo <span aria-hidden="true">↗</span></a><a class="text-link" href="#solicitudes">Consultar mis solicitudes</a></div>
          <p class="note">Precios, clientes y pedidos de demostración. No se realiza una compra ni una reserva real.</p>
        </div>
        <figure class="hero-figure">
          <img src="assets/images/bicicleta.svg" width="720" height="520" alt="Bicicleta con tres puntos de revisión: frenos, transmisión y ruedas.">
          <figcaption>Atención a los detalles que te mantienen en movimiento.</figcaption>
        </figure>
      </div>
      <div class="section process">
        <p class="eyebrow">ASÍ FUNCIONA</p><h2>Del catálogo al siguiente recorrido.</h2>
        <ol class="steps">
          <li><h3>Elegí</h3><p>Agregá servicios o accesorios al carrito.</p></li>
          <li><h3>Coordiná</h3><p>Completá tus datos y la modalidad de entrega.</p></li>
          <li><h3>Revisá</h3><p>Consultá el resumen y su costo estimado.</p></li>
          <li><h3>Gestioná</h3><p>Buscá, editá o eliminá la solicitud durante esta sesión.</p></li>
        </ol>
      </div>
      <aside class="notice"><h2>Una práctica con datos temporales</h2><p>Usá datos ficticios. La cobertura, los horarios y los costos reales deben confirmarse con Bicipedia CR.</p></aside>
    </section>

    <section id="servicios" class="section" data-seccion aria-labelledby="titulo-servicios" hidden>
      <div class="page-heading"><div><p class="eyebrow">SERVICIOS Y ACCESORIOS</p><h1 id="titulo-servicios" tabindex="-1">Cada bici tiene su próxima ruta.</h1><p class="lead">Un catálogo de prueba para elegir el cuidado de tu bicicleta.</p></div><a class="button" href="#solicitud">Revisar carrito <span aria-hidden="true">↗</span></a></div>
      <div class="filters">
        <div class="form-field"><label for="buscar-catalogo">Buscar en el catálogo</label><input type="search" id="buscar-catalogo" placeholder="Nombre o descripción"></div>
        <div class="form-field"><label for="categoria">Categoría</label><select id="categoria"><option value="todas">Todas</option><option value="servicios">Servicios técnicos</option><option value="accesorios">Accesorios</option></select></div>
      </div>
      <p id="catalogo-vacio" class="empty-state" hidden>No hay productos que coincidan con tu búsqueda.</p>
      <div id="catalogo" class="service-grid catalog-grid"></div>
      <p class="note section-note">Todos los precios y el impuesto del 13 % son simulados para esta práctica académica.</p>
    </section>

    <section id="solicitud" class="section" data-seccion aria-labelledby="titulo-formulario" hidden>
      <div class="page-heading"><div><p class="eyebrow" id="etiqueta-formulario">EL PRIMER PASO</p><h1 id="titulo-formulario" tabindex="-1">Prepará tu pedido.</h1><p class="lead">Revisá el carrito y completá los datos de tu solicitud.</p></div><a class="text-link" href="#servicios">Seguir eligiendo ↗</a></div>
      <p class="notice" id="aviso-formulario">Usá datos ficticios. Los campos con <strong>*</strong> son obligatorios. El pedido vive solo en esta pestaña.</p>
      <form id="formulario" action="php/validar.php" method="post" aria-describedby="aviso-formulario" novalidate>
        <fieldset id="campos-pedido">
          <legend>01 / Tu carrito</legend>
          <p id="carrito-vacio" class="empty-state">Tu carrito está vacío. <a href="#servicios">Elegí un servicio o accesorio</a> para empezar.</p>
          <div id="carrito" class="cart-list"></div>
          <div class="actions"><button type="button" id="vaciar-carrito" class="button-secondary" hidden>Vaciar carrito</button></div>
          <p id="error-items" class="field-error" role="status"></p>
        </fieldset>
        <fieldset id="campos-contacto"><legend>02 / Datos de contacto</legend>
          <div class="form-grid">
            <div class="form-field"><label for="nombre">Nombre *</label><input type="text" id="nombre" name="nombre" autocomplete="given-name" minlength="2" maxlength="60" required aria-describedby="error-nombre"><small id="error-nombre" class="field-error"></small></div>
            <div class="form-field"><label for="apellido">Apellido *</label><input type="text" id="apellido" name="apellido" autocomplete="family-name" minlength="2" maxlength="60" required aria-describedby="error-apellido"><small id="error-apellido" class="field-error"></small></div>
            <div class="form-field"><label for="correo">Correo electrónico *</label><input type="email" id="correo" name="correo" autocomplete="email" maxlength="120" placeholder="nombre@ejemplo.com" required aria-describedby="error-correo"><small id="error-correo" class="field-error"></small></div>
            <div class="form-field"><label for="telefono">Teléfono (opcional)</label><input type="tel" id="telefono" name="telefono" autocomplete="tel" maxlength="25" placeholder="8888 0000" aria-describedby="error-telefono"><small id="error-telefono" class="field-error"></small></div>
          </div>
        </fieldset>
        <fieldset id="campos-entrega"><legend>03 / Recolección o retiro</legend>
          <div class="form-grid">
            <div class="form-field"><label for="modalidad">Modalidad *</label><select id="modalidad" name="modalidad" required aria-describedby="error-modalidad"><option value="retiro">Retiro en taller · sin recargo</option><option value="domicilio">Recolección a domicilio · ₡2.500 de prueba</option></select><small id="error-modalidad" class="field-error"></small></div>
            <div class="form-field"><label for="fecha">Fecha preferida *</label><input type="date" id="fecha" name="fecha" required aria-describedby="ayuda-fecha error-fecha"><small id="ayuda-fecha">Hoy o una fecha posterior, según Costa Rica.</small><small id="error-fecha" class="field-error"></small></div>
            <div class="form-field full-width" id="campo-direccion" hidden><label for="direccion">Dirección de recolección *</label><input type="text" id="direccion" name="direccion" autocomplete="street-address" maxlength="180" aria-describedby="error-direccion"><small id="error-direccion" class="field-error"></small></div>
            <div class="form-field full-width"><label for="comentarios">Tu bicicleta y comentarios (opcional)</label><textarea id="comentarios" name="comentarios" rows="3" maxlength="500" aria-describedby="error-comentarios"></textarea><small id="error-comentarios" class="field-error"></small></div>
            <div class="form-field" id="campo-estado" hidden><label for="estado">Estado de la solicitud *</label><select id="estado" name="estado" aria-describedby="error-estado"><option value="pendiente">Pendiente</option><option value="en-atencion">En atención</option><option value="completada">Completada</option></select><small id="error-estado" class="field-error"></small></div>
          </div>
        </fieldset>
        <div class="checkout-grid">
          <div>
            <div class="checkbox-field"><input type="checkbox" id="terminos" name="terminos" value="1" required aria-describedby="error-terminos"><label for="terminos">Entiendo que esta solicitud es de prueba y que sus datos desaparecen al recargar. *</label></div>
            <p id="error-terminos" class="field-error"></p>
            <p id="errores-formulario" class="notice error-message" role="alert" tabindex="-1" hidden></p>
            <div class="actions"><button type="submit" id="guardar">Crear solicitud</button><button type="button" id="cancelar-edicion" class="button-secondary" hidden>Cancelar edición</button></div>
            <p id="estado-envio" class="note" role="status" aria-live="polite"></p>
          </div>
          <aside class="order-summary" aria-labelledby="titulo-resumen"><h2 id="titulo-resumen">Resumen estimado</h2><dl id="resumen-carrito"></dl><p class="note">Importes de prueba. Impuesto simulado: 13 %.</p></aside>
        </div>
      </form>
    </section>

    <section id="solicitudes" class="section" data-seccion aria-labelledby="titulo-listado" hidden>
      <div class="page-heading"><div><p class="eyebrow">RECOLECCIÓN Y ENTREGA</p><h1 id="titulo-listado" tabindex="-1">Solicitudes de servicio</h1><p class="lead">Tus pedidos durante esta sesión, en un solo lugar.</p></div><a class="button" href="#solicitud">Nuevo pedido ↗</a></div>
      <div class="filters">
        <div class="form-field"><label for="buscar-solicitudes">Buscar solicitudes</label><input type="search" id="buscar-solicitudes" placeholder="Código, cliente, correo o producto"></div>
        <div class="form-field"><label for="filtro-estado">Estado</label><select id="filtro-estado"><option value="todos">Todos</option><option value="pendiente">Pendientes</option><option value="en-atencion">En atención</option><option value="completada">Completadas</option></select></div>
      </div>
      <p id="conteo-listado" class="note section-note" role="status" aria-live="polite"></p>
      <p id="solicitudes-vacias" class="empty-state">Todavía no hay solicitudes. <a href="#servicios">Explorá el catálogo</a> para crear la primera.</p>
      <p id="sin-resultados" class="empty-state" hidden>No hay solicitudes que coincidan con tu búsqueda o filtro.</p>
      <p class="note">En pantallas pequeñas, desplazá la tabla horizontalmente. También podés enfocarla con Tab y usar las flechas.</p>
      <div id="tabla-solicitudes" class="table-scroll" role="region" aria-label="Tabla de solicitudes temporales" tabindex="0" hidden>
        <table><caption>Solicitudes temporales de Bicipedia CR · importes de prueba</caption><thead><tr><th scope="col">Solicitud</th><th scope="col">Cliente</th><th scope="col">Pedido</th><th scope="col">Fecha</th><th scope="col">Estado</th><th scope="col">Total</th><th scope="col">Acciones</th></tr></thead><tbody id="lista-solicitudes"></tbody></table>
      </div>
      <aside class="status-guide"><h2>Cómo leer los estados</h2><dl><dt>Pendiente</dt><dd>Por revisar y coordinar.</dd><dt>En atención</dt><dd>En diagnóstico, mantenimiento o preparación.</dd><dt>Completada</dt><dd>Servicio y entrega finalizados.</dd></dl></aside>
    </section>

    <section id="dashboard" class="section" data-seccion aria-labelledby="titulo-dashboard" hidden>
      <div class="page-heading"><div><p class="eyebrow">PANORAMA DEL SERVICIO</p><h1 id="titulo-dashboard" tabindex="-1">Cada solicitud cuenta.</h1><p class="lead">Un resumen que cambia junto con tus pedidos.</p></div><a class="text-link" href="#solicitudes">Consultar el listado ↗</a></div>
      <div class="dashboard-grid">
        <article class="metric-card"><h2>Solicitudes</h2><p class="metric-value" id="metric-total">0</p><p>Registros en esta pestaña.</p></article>
        <article class="metric-card"><h2>Pendientes</h2><p class="metric-value" id="metric-pendiente">0</p><p>Por revisar y coordinar.</p></article>
        <article class="metric-card"><h2>En atención</h2><p class="metric-value" id="metric-en-atencion">0</p><p>En servicio o preparación.</p></article>
        <article class="metric-card"><h2>Completadas</h2><p class="metric-value" id="metric-completada">0</p><p>Servicio y entrega finalizados.</p></article>
      </div>
      <aside class="notice"><h2>Total estimado de los pedidos</h2><p id="metric-importe" class="summary-amount">₡0,00</p><p>Se recalcula al crear, editar o eliminar. Es la suma de los pedidos de prueba, sin registrar pagos.</p></aside>
    </section>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><p><strong>Bicipedia CR</strong> · Laboratorio 1</p><p>Demostración académica · Datos temporales y precios ficticios.</p></div></footer>
</body>
</html>
