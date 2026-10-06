// Catálogo fijo de demostración. Ningún registro del usuario se guarda aquí.
export const productos = [
  { id: 'mantenimiento', nombre: 'Mantenimiento general', categoria: 'servicios', precio: 12900, descripcion: 'Revisión, limpieza y ajustes para dejar tu bicicleta lista para la ruta.' },
  { id: 'ajustes', nombre: 'Frenos y transmisión', categoria: 'servicios', precio: 7500, descripcion: 'Ajuste del frenado, los cambios y el funcionamiento de la cadena.' },
  { id: 'diagnostico', nombre: 'Diagnóstico', categoria: 'servicios', precio: 3500, descripcion: 'Una revisión inicial para identificar qué atención necesita tu bicicleta.' },
  { id: 'kit', nombre: 'Kit de cuidado de bicicleta', categoria: 'accesorios', precio: 9500, descripcion: 'Un kit ficticio de limpieza y lubricación para acompañar tu siguiente recorrido.' },
];
export const estados = { pendiente: 'Pendiente', 'en-atencion': 'En atención', completada: 'Completada' };
export const MAX_CANTIDAD = 20;
export const ENVIO_CENTIMOS = 250000;

// Se trabaja con céntimos enteros para no acumular errores de coma flotante.
export function calcularTotales(items, modalidad) {
  const subtotalCentimos = items.reduce((suma, item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    return suma + (producto ? producto.precio * 100 * item.cantidad : 0);
  }, 0);
  const impuestoCentimos = Math.round(subtotalCentimos * 13 / 100);
  const envioCentimos = items.length && modalidad === 'domicilio' ? ENVIO_CENTIMOS : 0;
  return { subtotalCentimos, impuestoCentimos, envioCentimos, totalCentimos: subtotalCentimos + impuestoCentimos + envioCentimos };
}

export function fechaHoy() {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const obtener = (tipo) => partes.find((p) => p.type === tipo).value;
  return `${obtener('year')}-${obtener('month')}-${obtener('day')}`;
}
