import { productos, estados, MAX_CANTIDAD, fechaHoy } from './datos-iniciales.js';

// Función pura: devuelve errores sin modificar el formulario ni los registros.
export function validarPedido(datos, items) {
  const errores = {};
  const limites = { nombre: 60, apellido: 60, correo: 120, telefono: 25, direccion: 180, comentarios: 500 };
  for (const [campo, limite] of Object.entries(limites)) {
    if ([...datos[campo]].length > limite) errores[campo] = `Máximo ${limite} caracteres.`;
  }
  for (const campo of ['nombre', 'apellido']) {
    if ([...datos[campo]].length < 2) errores[campo] = 'Ingresá al menos dos caracteres.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) errores.correo = 'Ingresá un correo válido.';
  if (datos.telefono && !/^[+0-9() .-]{7,25}$/.test(datos.telefono)) errores.telefono = 'Ingresá un teléfono válido o dejalo vacío.';
  if (!['retiro', 'domicilio'].includes(datos.modalidad)) errores.modalidad = 'Elegí una modalidad válida.';
  if (datos.modalidad === 'domicilio' && [...datos.direccion].length < 8) errores.direccion = 'Ingresá una dirección de al menos ocho caracteres.';
  if (!Object.hasOwn(estados, datos.estado)) errores.estado = 'Elegí un estado válido.';
  const fecha = new Date(`${datos.fecha}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) || Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== datos.fecha || datos.fecha < fechaHoy()) {
    errores.fecha = 'Elegí hoy o una fecha futura válida.';
  }
  if (datos.terminos !== '1') errores.terminos = 'Confirmá el carácter temporal de la solicitud.';
  const ids = new Set();
  if (!items.length) errores.items = 'Agregá al menos un producto al carrito.';
  for (const item of items) {
    if (!productos.some((p) => p.id === item.productoId) || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > MAX_CANTIDAD || ids.has(item.productoId)) {
      errores.items = `Usá productos del catálogo y cantidades enteras entre 1 y ${MAX_CANTIDAD}.`;
    }
    ids.add(item.productoId);
  }
  return errores;
}
