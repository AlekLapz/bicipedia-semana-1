import { productos, estados, MAX_CANTIDAD, calcularTotales, fechaHoy } from './datos-iniciales.js';
import { validarPedido } from './validaciones.js';

// Única fuente de estado temporal. Recargar vuelve a ejecutar este módulo desde cero.
const estado = { solicitudes: [], carrito: [], editandoId: null, siguienteId: 1, enviando: false };
const formulario = document.querySelector('#formulario');
let validacionActiva = false;
const secciones = [...document.querySelectorAll('[data-seccion]')];
const formatoMoneda = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 });
const $ = (selector) => document.querySelector(selector);
const moneda = (centimos) => formatoMoneda.format(centimos / 100);
const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();

// textContent permite mostrar datos del usuario sin interpretarlos como HTML.
function nodo(etiqueta, texto, clase = '') {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}

function mostrarMensaje(texto) {
  const mensaje = $('#mensaje-global');
  mensaje.textContent = texto;
  mensaje.hidden = false;
}

function mostrarSeccion(enfocar = true) {
  const ruta = location.hash.slice(1);
  if (ruta === 'contenido') return; // El enlace para saltar contenido no cambia la vista.
  const seccion = secciones.find((s) => s.id === ruta) ?? secciones[0];
  for (const elemento of secciones) elemento.hidden = elemento !== seccion;
  for (const enlace of document.querySelectorAll('.site-nav a')) {
    if (enlace.hash === `#${seccion.id}`) enlace.setAttribute('aria-current', 'page');
    else enlace.removeAttribute('aria-current');
  }
  document.title = `${seccion.querySelector('h1').textContent} | Bicipedia CR`;
  if (seccion.id === 'solicitud') $('#fecha').min = fechaHoy();
  if (enfocar) seccion.querySelector('h1').focus();
}

function navegar(id) {
  if (location.hash === `#${id}`) mostrarSeccion();
  else location.hash = id;
}

function renderizarCatalogo() {
  const busqueda = normalizar($('#buscar-catalogo').value);
  const categoria = $('#categoria').value;
  const visibles = productos.filter((p) => (categoria === 'todas' || p.categoria === categoria) && normalizar(`${p.nombre} ${p.descripcion}`).includes(busqueda));
  const tarjetas = visibles.map((producto) => {
    const tarjeta = nodo('article', '', 'service-card');
    tarjeta.append(nodo('p', producto.categoria === 'servicios' ? 'SERVICIO TÉCNICO' : 'ACCESORIO', 'eyebrow'), nodo('h2', producto.nombre), nodo('p', producto.descripcion), nodo('p', moneda(producto.precio * 100), 'product-price'));
    const boton = nodo('button', 'Agregar al carrito');
    boton.type = 'button';
    boton.dataset.agregar = producto.id;
    boton.setAttribute('aria-label', `Agregar ${producto.nombre} al carrito`);
    tarjeta.append(boton);
    return tarjeta;
  });
  $('#catalogo').replaceChildren(...tarjetas);
  $('#catalogo-vacio').hidden = visibles.length > 0;
}

function agregarProducto(id) {
  if (estado.enviando) return;
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;
  const item = estado.carrito.find((i) => i.productoId === id);
  if (item && item.cantidad === MAX_CANTIDAD) {
    mostrarMensaje(`Podés agregar hasta ${MAX_CANTIDAD} unidades de ${producto.nombre}.`);
    return;
  }
  if (item) item.cantidad += 1;
  else estado.carrito.push({ productoId: id, cantidad: 1 });
  mostrarErrores({});
  renderizarCarrito();
  mostrarMensaje(`${producto.nombre} agregado al carrito.`);
}

function renderizarCarrito() {
  const lineas = estado.carrito.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    const linea = nodo('article', '', 'cart-item');
    linea.dataset.producto = producto.id;
    const descripcion = nodo('div', '');
    descripcion.append(nodo('h2', producto.nombre), nodo('p', `${moneda(producto.precio * 100)} por unidad`, 'note'));
    const control = nodo('div', '', 'form-field quantity-field');
    const etiqueta = nodo('label', 'Cantidad');
    etiqueta.htmlFor = `cantidad-${producto.id}`;
    const cantidad = document.createElement('input');
    Object.assign(cantidad, { type: 'number', id: `cantidad-${producto.id}`, min: '1', max: String(MAX_CANTIDAD), step: '1', value: String(item.cantidad) });
    cantidad.dataset.cantidad = producto.id;
    cantidad.setAttribute('aria-label', `Cantidad de ${producto.nombre}`);
    control.append(etiqueta, cantidad);
    const quitar = nodo('button', 'Quitar', 'button-secondary');
    quitar.type = 'button';
    quitar.dataset.quitar = producto.id;
    quitar.setAttribute('aria-label', `Quitar ${producto.nombre} del carrito`);
    linea.append(descripcion, control, nodo('p', moneda(producto.precio * 100 * item.cantidad), 'line-total'), quitar);
    return linea;
  });
  $('#carrito').replaceChildren(...lineas);
  $('#carrito-vacio').hidden = estado.carrito.length > 0;
  $('#vaciar-carrito').hidden = estado.carrito.length === 0;
  $('#contador-carrito').textContent = String(estado.carrito.reduce((suma, i) => suma + i.cantidad, 0));
  renderizarResumen();
}

function renderizarResumen() {
  const totales = calcularTotales(estado.carrito, $('#modalidad').value);
  const filas = [['Subtotal', totales.subtotalCentimos], ['Impuesto de prueba · 13 %', totales.impuestoCentimos], ['Recolección', totales.envioCentimos], ['Total estimado', totales.totalCentimos]];
  $('#resumen-carrito').replaceChildren(...filas.flatMap(([nombre, importe]) => [nodo('dt', nombre), nodo('dd', moneda(importe))]));
}

function actualizarModalidad() {
  const domicilio = $('#modalidad').value === 'domicilio';
  $('#campo-direccion').hidden = !domicilio;
  $('#direccion').required = domicilio;
  renderizarResumen();
}

function mostrarErrores(errores) {
  for (const elemento of document.querySelectorAll('[id^="error-"]')) elemento.textContent = '';
  for (const control of formulario.querySelectorAll('[aria-invalid]')) control.removeAttribute('aria-invalid');
  for (const [campo, texto] of Object.entries(errores)) {
    const mensaje = document.getElementById(`error-${campo}`);
    if (mensaje) mensaje.textContent = texto;
    const control = formulario.elements.namedItem(campo);
    if (control instanceof HTMLElement) control.setAttribute('aria-invalid', 'true');
  }
  const resumen = $('#errores-formulario');
  resumen.hidden = Object.keys(errores).length === 0;
  resumen.textContent = Object.values(errores).join(' ');
}

function limpiarFormulario() {
  formulario.reset();
  validacionActiva = false;
  estado.editandoId = null;
  estado.carrito = [];
  $('#campo-estado').hidden = true;
  $('#cancelar-edicion').hidden = true;
  $('#guardar').textContent = 'Crear solicitud';
  $('#etiqueta-formulario').textContent = 'EL PRIMER PASO';
  $('#titulo-formulario').textContent = 'Prepará tu pedido.';
  mostrarErrores({});
  actualizarModalidad();
  renderizarCarrito();
}

function crearSolicitud(datos) {
  const id = `BIC-${String(estado.siguienteId++).padStart(3, '0')}`;
  estado.solicitudes.unshift({ id, ...datos });
  return id;
}

function buscarSolicitud(id) {
  return estado.solicitudes.find((s) => s.id === id);
}

function editarSolicitud(id, datos) {
  estado.solicitudes = estado.solicitudes.map((s) => s.id === id ? { id, ...datos } : s);
}

function cargarEdicion(id) {
  if (estado.enviando) return;
  const solicitud = buscarSolicitud(id);
  if (!solicitud) return;
  validacionActiva = false;
  estado.editandoId = id;
  estado.carrito = solicitud.items.map(({ productoId, cantidad }) => ({ productoId, cantidad }));
  for (const campo of ['nombre', 'apellido', 'correo', 'telefono', 'modalidad', 'fecha', 'direccion', 'comentarios', 'estado']) formulario.elements.namedItem(campo).value = solicitud[campo];
  $('#terminos').checked = true;
  $('#campo-estado').hidden = false;
  $('#cancelar-edicion').hidden = false;
  $('#guardar').textContent = 'Guardar cambios';
  $('#etiqueta-formulario').textContent = `EDITANDO ${id}`;
  $('#titulo-formulario').textContent = 'Ajustá tu pedido.';
  mostrarErrores({});
  actualizarModalidad();
  renderizarCarrito();
  navegar('solicitud');
}

function eliminarSolicitud(id) {
  if (estado.enviando || !buscarSolicitud(id)) return;
  if (!window.confirm(`¿Eliminar la solicitud ${id}? Esta acción no se puede deshacer durante esta sesión.`)) return;
  estado.solicitudes = estado.solicitudes.filter((s) => s.id !== id);
  if (estado.editandoId === id) limpiarFormulario();
  renderizarSolicitudes();
  renderizarDashboard();
  mostrarMensaje(`Solicitud ${id} eliminada.`);
  $('#titulo-listado').focus();
}

function renderizarSolicitudes() {
  const texto = normalizar($('#buscar-solicitudes').value);
  const filtro = $('#filtro-estado').value;
  const visibles = estado.solicitudes.filter((s) => (filtro === 'todos' || filtro === s.estado) && normalizar(`${s.id} ${s.nombre} ${s.apellido} ${s.correo} ${s.items.map((i) => i.nombre).join(' ')}`).includes(texto));
  const filas = visibles.map((s) => {
    const fila = document.createElement('tr');
    fila.dataset.id = s.id;
    const codigo = nodo('th', s.id);
    codigo.scope = 'row';
    const cliente = nodo('td', '');
    cliente.append(nodo('p', `${s.nombre} ${s.apellido}`), nodo('small', s.correo));
    const pedido = nodo('td', '');
    pedido.append(nodo('p', s.items.map((i) => `${i.cantidad} × ${i.nombre}`).join(', ')), nodo('small', s.modalidad === 'domicilio' ? `Domicilio: ${s.direccion}` : 'Retiro en taller'));
    const fecha = nodo('td', '');
    const tiempo = nodo('time', s.fecha.split('-').reverse().join('/'));
    tiempo.dateTime = s.fecha;
    fecha.append(tiempo);
    const status = nodo('td', '');
    const clase = { pendiente: 'pending', 'en-atencion': 'active', completada: 'complete' }[s.estado];
    status.append(nodo('span', estados[s.estado], `status ${clase}`));
    const acciones = nodo('td', '', 'row-actions');
    for (const [accion, etiqueta] of [['editar', 'Editar'], ['eliminar', 'Eliminar']]) {
      const boton = nodo('button', etiqueta, 'button-secondary');
      boton.type = 'button';
      boton.dataset.accion = accion;
      boton.setAttribute('aria-label', `${etiqueta} ${s.id}`);
      acciones.append(boton);
    }
    fila.append(codigo, cliente, pedido, fecha, status, nodo('td', moneda(s.totales.totalCentimos), 'money-cell'), acciones);
    return fila;
  });
  $('#lista-solicitudes').replaceChildren(...filas);
  $('#solicitudes-vacias').hidden = estado.solicitudes.length > 0;
  $('#sin-resultados').hidden = !estado.solicitudes.length || visibles.length > 0;
  $('#tabla-solicitudes').hidden = visibles.length === 0;
  $('#conteo-listado').textContent = `${visibles.length} de ${estado.solicitudes.length} solicitudes`;
}

function renderizarDashboard() {
  $('#metric-total').textContent = String(estado.solicitudes.length);
  for (const id of Object.keys(estados)) $(`#metric-${id}`).textContent = String(estado.solicitudes.filter((s) => s.estado === id).length);
  $('#metric-importe').textContent = moneda(estado.solicitudes.reduce((suma, s) => suma + s.totales.totalCentimos, 0));
}

function bloquearFormulario(bloquear) {
  estado.enviando = bloquear;
  for (const campo of formulario.querySelectorAll('fieldset, #terminos, #guardar, #cancelar-edicion')) campo.disabled = bloquear;
  $('#guardar').textContent = bloquear ? 'Validando…' : (estado.editandoId ? 'Guardar cambios' : 'Crear solicitud');
  $('#estado-envio').textContent = bloquear ? 'Validando la solicitud, un momento…' : '';
}

function leerFormulario() {
  const campos = new FormData(formulario);
  const datos = Object.fromEntries([...campos].map(([nombre, valor]) => [nombre, String(valor).trim()]));
  datos.terminos = $('#terminos').checked ? '1' : '';
  datos.estado = estado.editandoId ? $('#estado').value : 'pendiente';
  return { campos, datos };
}

function revisarCorrecciones() {
  if (validacionActiva && !estado.enviando) mostrarErrores(validarPedido(leerFormulario().datos, estado.carrito));
}

async function procesarFormulario(evento) {
  evento.preventDefault();
  if (estado.enviando) return;
  $('#fecha').min = fechaHoy();
  validacionActiva = true;
  const { campos, datos } = leerFormulario();
  const items = estado.carrito.map((i) => ({ ...i }));
  const errores = validarPedido(datos, items);
  mostrarErrores(errores);
  if (Object.keys(errores).length) {
    $('#errores-formulario').focus();
    return;
  }
  campos.set('items', JSON.stringify(items));
  campos.set('estado', datos.estado);
  campos.set('terminos', datos.terminos);
  const controlador = new AbortController();
  const tiempo = window.setTimeout(() => controlador.abort(), 15000);
  bloquearFormulario(true);
  try {
    const respuesta = await fetch('php/validar.php', { method: 'POST', body: campos, signal: controlador.signal, cache: 'no-store' });
    if (!respuesta.headers.get('content-type')?.includes('application/json')) throw new Error('Respuesta PHP no disponible.');
    const resultado = await respuesta.json();
    if (!respuesta.ok || !resultado.ok) {
      if (respuesta.status === 422 && resultado.errores && typeof resultado.errores === 'object') {
        mostrarErrores(resultado.errores);
        $('#errores-formulario').focus();
        return;
      }
      throw new Error(`No se pudo validar: HTTP ${respuesta.status}.`);
    }
    if (!resultado.datos || !Array.isArray(resultado.datos.items) || !Number.isSafeInteger(resultado.datos.totales?.totalCentimos)) throw new Error('Respuesta de validación incompleta.');
    const editando = estado.editandoId;
    const id = editando ?? crearSolicitud(resultado.datos);
    if (editando) editarSolicitud(id, resultado.datos);
    limpiarFormulario();
    // Un pedido nuevo debe resultar visible aun si había filtros de una búsqueda anterior.
    $('#buscar-solicitudes').value = '';
    $('#filtro-estado').value = 'todos';
    renderizarSolicitudes();
    renderizarDashboard();
    mostrarMensaje(`Solicitud ${id} ${editando ? 'actualizada' : 'creada'}. Sus datos son temporales.`);
    navegar('solicitudes');
  } catch (error) {
    mostrarErrores({ general: error.name === 'AbortError' ? 'La validación tardó demasiado. Intentá de nuevo; tu carrito sigue disponible.' : 'No se pudo validar el pedido. Revisá la conexión e intentá de nuevo; tu carrito sigue disponible.' });
    $('#errores-formulario').focus();
  } finally {
    window.clearTimeout(tiempo);
    bloquearFormulario(false);
  }
}

// Delegación: los botones de catálogo, carrito y lista se generan dinámicamente.
$('#catalogo').addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-agregar]');
  if (boton) agregarProducto(boton.dataset.agregar);
});
$('#carrito').addEventListener('change', (evento) => {
  const input = evento.target.closest('[data-cantidad]');
  if (!input || estado.enviando) return;
  const item = estado.carrito.find((i) => i.productoId === input.dataset.cantidad);
  const cantidad = Number(input.value);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_CANTIDAD) {
    input.value = String(item.cantidad);
    mostrarMensaje(`La cantidad debe ser un entero entre 1 y ${MAX_CANTIDAD}.`);
    return;
  }
  item.cantidad = cantidad;
  renderizarCarrito();
  document.getElementById(input.id).focus();
});
$('#carrito').addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-quitar]');
  if (!boton || estado.enviando) return;
  estado.carrito = estado.carrito.filter((i) => i.productoId !== boton.dataset.quitar);
  renderizarCarrito();
  mostrarMensaje('Producto quitado del carrito.');
  $('#titulo-formulario').focus();
});
$('#vaciar-carrito').addEventListener('click', () => {
  if (estado.enviando || !window.confirm('¿Vaciar todos los productos del carrito?')) return;
  estado.carrito = [];
  renderizarCarrito();
  mostrarMensaje('Carrito vacío.');
  $('#titulo-formulario').focus();
});
$('#lista-solicitudes').addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-accion]');
  if (!boton) return;
  const id = boton.closest('[data-id]').dataset.id;
  if (boton.dataset.accion === 'editar') cargarEdicion(id);
  if (boton.dataset.accion === 'eliminar') eliminarSolicitud(id);
});
$('#cancelar-edicion').addEventListener('click', () => {
  if (estado.enviando) return;
  limpiarFormulario();
  mostrarMensaje('Edición cancelada. El pedido original conserva sus datos.');
  navegar('solicitudes');
});
$('#modalidad').addEventListener('change', actualizarModalidad);
$('#buscar-catalogo').addEventListener('input', renderizarCatalogo);
$('#categoria').addEventListener('change', renderizarCatalogo);
$('#buscar-solicitudes').addEventListener('input', renderizarSolicitudes);
$('#filtro-estado').addEventListener('change', renderizarSolicitudes);
formulario.addEventListener('submit', procesarFormulario);
formulario.addEventListener('input', revisarCorrecciones);
formulario.addEventListener('change', revisarCorrecciones);
window.addEventListener('hashchange', () => mostrarSeccion());

$('#fecha').min = fechaHoy();
renderizarCatalogo();
renderizarCarrito();
renderizarSolicitudes();
renderizarDashboard();
mostrarSeccion(false);
