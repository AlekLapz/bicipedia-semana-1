import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { productos, calcularTotales, fechaHoy } from '../js/datos-iniciales.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const raiz = fileURLToPath(new URL('../', import.meta.url));
const evidencias = new URL('../evidencias/', import.meta.url);
const resultados = [];
let servidor;
let browser;
let base = process.env.BASE_URL;

async function prueba(nombre, ejecutar) {
  await ejecutar();
  resultados.push({ prueba: nombre, resultado: 'aprobada' });
  console.log(`OK: ${nombre}`);
}
const demora = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const datosValidos = (items = [{ productoId: 'mantenimiento', cantidad: 1 }]) => ({ nombre: 'Ana', apellido: 'Mora', correo: 'ana@example.com', telefono: '', modalidad: 'retiro', fecha: fechaHoy(), direccion: '', comentarios: '', estado: 'pendiente', terminos: '1', items: JSON.stringify(items) });

try {
  await mkdir(new URL('capturas/', evidencias), { recursive: true });
  if (!base) {
    const puertoLibre = createServer();
    await new Promise((resolve) => puertoLibre.listen(0, '127.0.0.1', resolve));
    const puerto = puertoLibre.address().port;
    await new Promise((resolve) => puertoLibre.close(resolve));
    base = `http://127.0.0.1:${puerto}`;
    servidor = spawn(process.env.PHP_BIN || 'php', ['-S', `127.0.0.1:${puerto}`, '-t', raiz], { cwd: raiz, windowsHide: true, stdio: 'ignore' });
    let fallo;
    servidor.on('error', (error) => { fallo = error; });
    for (let intento = 0; intento < 50; intento++) {
      if (fallo) throw fallo;
      try { if ((await fetch(`${base}/index.php`)).ok) break; } catch { /* Esperar arranque. */ }
      await demora(100);
    }
    assert.equal((await fetch(`${base}/index.php`)).status, 200);
  }
  const post = async (datos) => {
    const respuesta = await fetch(`${base}/php/validar.php`, { method: 'POST', body: new URLSearchParams(datos) });
    return { status: respuesta.status, headers: respuesta.headers, body: await respuesta.json() };
  };

  await prueba('PHP: POST válido, sin cookies, sin cache y con importes calculados por servidor', async () => {
    const r = await post({ ...datosValidos(), precio: '1', totalCentimos: '1' });
    assert.equal(r.status, 200);
    assert.equal(r.body.datos.totales.totalCentimos, 1457700);
    assert.equal(r.headers.get('set-cookie'), null);
    assert.equal(r.headers.get('cache-control'), 'no-store');
    assert.equal((await fetch(`${base}/php/validar.php`)).status, 405);
  });
  await prueba('PHP: catálogo y cálculos coinciden con JavaScript para cada producto y modalidad', async () => {
    for (const producto of productos) {
      for (const modalidad of ['retiro', 'domicilio']) {
        const items = [{ productoId: producto.id, cantidad: 3 }];
        const r = await post({ ...datosValidos(items), modalidad, direccion: 'Dirección ficticia del taller' });
        assert.equal(r.status, 200);
        assert.equal(r.body.datos.items[0].nombre, producto.nombre);
        assert.deepEqual(r.body.datos.totales, calcularTotales(items, modalidad));
      }
    }
  });
  await prueba('PHP: entradas inválidas, producto inexistente, cantidades, duplicados y fechas se rechazan', async () => {
    const variantes = [
      { nombre: ' ' }, { correo: 'invalido' }, { modalidad: 'otro' }, { modalidad: 'domicilio', direccion: '' },
      { fecha: '2000-01-01' }, { fecha: '2030-02-30' }, { fecha: '2030-\u0000-01' }, { estado: 'otro' }, { terminos: '' }, { comentarios: 'a'.repeat(501) },
      { items: '{}' }, { items: '{' }, { items: '[]' }, { items: '[null]' },
      { items: JSON.stringify([{ productoId: 'no-existe', cantidad: 1 }]) },
      ...[0, -1, 21, 1.5, '2'].map((cantidad) => ({ items: JSON.stringify([{ productoId: 'kit', cantidad }]) })),
      { items: JSON.stringify([{ productoId: 'kit', cantidad: 1 }, { productoId: 'kit', cantidad: 1 }]) },
    ];
    for (const variante of variantes) {
      const r = await post({ ...datosValidos(), ...variante });
      assert.equal(r.status, 422, JSON.stringify(variante));
      assert.equal(r.body.ok, false);
    }
    const r = await post({ ...datosValidos(), comentarios: 'a'.repeat(21000) });
    assert.equal(r.status, 413);
    const respuesta = await fetch(`${base}/php/validar.php`, { method: 'POST', body: new URLSearchParams({ ...datosValidos(), 'nombre[]': 'Ana', nombre: '' }) });
    assert.equal(respuesta.status, 422);
  });

  browser = await chromium.launch(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH, headless: true } : { channel: process.platform === 'win32' ? 'msedge' : 'chromium', headless: true });
  const contexto = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await contexto.newPage();
  const erroresPagina = [];
  page.on('pageerror', (error) => erroresPagina.push(error.message));
  page.on('console', (mensaje) => { if (mensaje.type() === 'error') erroresPagina.push(mensaje.text()); });
  const ir = async (seccion) => { await page.locator(`.site-nav a[href="#${seccion}"]`).click(); await page.locator(`#${seccion}`).waitFor({ state: 'visible' }); };
  const capturar = async (nombre) => page.screenshot({ path: fileURLToPath(new URL(`capturas/${nombre}.png`, evidencias)), fullPage: true });
  const contacto = async () => {
    await page.locator('#nombre').fill('Ana');
    await page.locator('#apellido').fill('Mora');
    await page.locator('#correo').fill('ana@example.com');
    await page.locator('#fecha').fill(fechaHoy());
    await page.locator('#terminos').check();
  };
  await page.goto(`${base}/index.php`);
  await page.locator('#catalogo article').first().waitFor({ state: 'attached' });

  await prueba('Inicio limpio y cinco secciones accesibles', async () => {
    assert.equal(await page.locator('[data-seccion]').count(), 5);
    assert.equal(await page.locator('[data-seccion]:visible').count(), 1);
    assert.equal(await page.locator('#metric-total').textContent(), '0');
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 0);
    await capturar('01-inicio-1280');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate((e) => document.activeElement === e), true);
  });
  await prueba('Catálogo: búsqueda, filtro y mensaje sin resultados', async () => {
    await ir('servicios');
    await capturar('02-catalogo-1280');
    await page.locator('#categoria').selectOption('accesorios');
    assert.equal(await page.locator('#catalogo article').count(), 1);
    await page.locator('#buscar-catalogo').fill('no-existe');
    assert.equal(await page.locator('#catalogo-vacio').isVisible(), true);
    await page.locator('#buscar-catalogo').fill('');
    await page.locator('#categoria').selectOption('todas');
  });
  await prueba('Carrito: altas, cantidades, límites, eliminación y navegación sin recarga', async () => {
    await page.locator('[data-agregar="mantenimiento"]').click();
    await page.locator('[data-agregar="kit"]').click();
    await ir('solicitud');
    await page.locator('#cantidad-mantenimiento').fill('2');
    await page.locator('#cantidad-mantenimiento').press('Tab');
    assert.equal(await page.locator('#contador-carrito').textContent(), '3');
    await page.locator('#cantidad-mantenimiento').fill('21');
    await page.locator('#cantidad-mantenimiento').press('Tab');
    assert.equal(await page.locator('#cantidad-mantenimiento').inputValue(), '2');
    await page.locator('[data-quitar="kit"]').click();
    await ir('dashboard');
    await ir('solicitud');
    assert.equal(await page.locator('#cantidad-mantenimiento').inputValue(), '2');
  });
  await prueba('Formulario vacío no registra ni envía; crear valida por PHP y actualiza listado/dashboard', async () => {
    await page.locator('#guardar').click();
    assert.equal(await page.locator('#errores-formulario').isVisible(), true);
    assert.equal(await page.locator('#nombre').getAttribute('aria-invalid'), 'true');
    await contacto();
    await page.locator('#modalidad').selectOption('domicilio');
    await page.locator('#direccion').fill('Dirección ficticia, barrio de prueba');
    assert.equal(await page.locator('#errores-formulario').isVisible(), false);
    assert.equal(await page.locator('#nombre').getAttribute('aria-invalid'), null);
    await capturar('03-formulario-y-carrito-1280');
    await page.locator('#guardar').click();
    await page.locator('#solicitudes').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 1);
    assert.equal(await page.locator('#lista-solicitudes tr th').textContent(), 'BIC-001');
    assert.equal(await page.locator('#metric-total').textContent(), '1');
    assert.equal(await page.locator('#metric-pendiente').textContent(), '1');
  });
  await prueba('Búsqueda existente/inexistente y filtros por estado', async () => {
    await page.locator('#buscar-solicitudes').fill('ana@example.com');
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 1);
    await page.locator('#buscar-solicitudes').fill('no-existe');
    assert.equal(await page.locator('#sin-resultados').isVisible(), true);
    await page.locator('#buscar-solicitudes').fill('');
    await page.locator('#filtro-estado').selectOption('completada');
    assert.equal(await page.locator('#sin-resultados').isVisible(), true);
    await page.locator('#filtro-estado').selectOption('todos');
  });
  await prueba('Edición cancelable, mismo ID, totales y métricas actualizados; texto del usuario seguro', async () => {
    await page.getByRole('button', { name: 'Editar BIC-001', exact: true }).click();
    await page.locator('#nombre').fill('Cambio cancelado');
    await page.locator('#cantidad-mantenimiento').fill('1');
    await page.locator('#cantidad-mantenimiento').press('Tab');
    await page.locator('#cancelar-edicion').click();
    assert.match(await page.locator('#lista-solicitudes').textContent(), /Ana Mora/);
    assert.match(await page.locator('#lista-solicitudes').textContent(), /2 × Mantenimiento/);
    await page.getByRole('button', { name: 'Editar BIC-001', exact: true }).click();
    await page.locator('#nombre').fill('<img src=x onerror=alert(1)>');
    await page.locator('#cantidad-mantenimiento').fill('1');
    await page.locator('#cantidad-mantenimiento').press('Tab');
    await page.locator('#modalidad').selectOption('retiro');
    await page.locator('#estado').selectOption('completada');
    await page.locator('#guardar').click();
    await page.locator('#solicitudes').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 1);
    assert.equal(await page.locator('#lista-solicitudes img').count(), 0);
    assert.match(await page.locator('#lista-solicitudes').textContent(), /<img src=x onerror=alert\(1\)>/);
    assert.equal(await page.locator('#metric-completada').textContent(), '1');
    assert.equal(await page.locator('#metric-pendiente').textContent(), '0');
    // Volver a un nombre legible para las evidencias.
    await page.getByRole('button', { name: 'Editar BIC-001', exact: true }).click();
    await page.locator('#nombre').fill('Ana');
    await page.locator('#guardar').click();
    await page.locator('#solicitudes').waitFor({ state: 'visible' });
  });
  await prueba('Fallo HTTP conserva el carrito y no crea registros; reintento y doble envío crean solo uno', async () => {
    await ir('servicios');
    await page.locator('[data-agregar="diagnostico"]').click();
    await ir('solicitud');
    await contacto();
    await page.route('**/php/validar.php', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
    await page.locator('#guardar').click();
    await page.locator('#errores-formulario').waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.querySelector('#guardar').disabled);
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 1);
    assert.equal(await page.locator('#cantidad-diagnostico').inputValue(), '1');
    await page.unroute('**/php/validar.php');
    let envios = 0;
    await page.route('**/php/validar.php', async (route) => { envios++; await demora(150); await route.continue(); });
    await page.evaluate(() => { const f = document.querySelector('#formulario'); f.requestSubmit(); f.requestSubmit(); });
    await page.locator('#solicitudes').waitFor({ state: 'visible' });
    assert.equal(envios, 1);
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 2);
    await page.unroute('**/php/validar.php');
    await capturar('04-solicitudes-creadas-1280');
    await ir('dashboard');
    await capturar('05-dashboard-1280');
  });
  await prueba('Responsive: cinco secciones entre 320 y 1280 px, sin desbordamiento de página', async () => {
    for (const width of [320, 375, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const seccion of ['inicio', 'servicios', 'solicitud', 'solicitudes', 'dashboard']) {
        await ir(seccion);
        const medida = await page.evaluate(() => ({ pagina: document.documentElement.scrollWidth, ventana: window.innerWidth }));
        assert.ok(medida.pagina <= medida.ventana, `${seccion} a ${width}: ${JSON.stringify(medida)}`);
        assert.equal(await page.locator('[data-seccion]:visible h1').count(), 1);
      }
    }
    await page.setViewportSize({ width: 320, height: 720 });
    await ir('solicitudes');
    await capturar('06-solicitudes-320');
    await page.setViewportSize({ width: 768, height: 1024 });
    await ir('servicios');
    await capturar('07-catalogo-768');
    await page.setViewportSize({ width: 1280, height: 900 });
  });
  await prueba('Eliminar: cancelar conserva; confirmar elimina el registro correcto y actualiza métricas', async () => {
    await ir('solicitudes');
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('button', { name: 'Eliminar BIC-002', exact: true }).click();
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 2);
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Eliminar BIC-002', exact: true }).click();
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 1);
    assert.equal(await page.locator('#lista-solicitudes th').textContent(), 'BIC-001');
    assert.equal(await page.locator('#metric-total').textContent(), '1');
  });
  await prueba('Nueva pestaña y recarga reinician registros, carrito y dashboard sin almacenamiento', async () => {
    const otra = await contexto.newPage();
    await otra.goto(`${base}/index.php#solicitudes`);
    await otra.locator('#solicitudes').waitFor({ state: 'visible' });
    assert.equal(await otra.locator('#lista-solicitudes tr').count(), 0);
    await otra.close();
    await page.reload();
    await page.locator('#solicitudes').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#lista-solicitudes tr').count(), 0);
    assert.equal(await page.locator('#metric-total').textContent(), '0');
    assert.equal(await page.locator('#contador-carrito').textContent(), '0');
    const almacenamiento = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }));
    assert.deepEqual(almacenamiento, { local: 0, session: 0, cookies: '' });
    await capturar('08-reinicio-tras-recarga-1280');
  });
  await prueba('Entradas anteriores llegan a la sección correcta', async () => {
    for (const [archivo, seccion] of [['index.html', 'inicio'], ['listado.html', 'solicitudes'], ['formulario.html', 'solicitud'], ['dashboard.html', 'dashboard']]) {
      await page.goto(`${base}/${archivo}`);
      await page.waitForURL(`**/index.php#${seccion}`);
      await page.locator(`#${seccion}`).waitFor({ state: 'visible' });
    }
  });
  // Los 503 de la prueba de recuperación son errores HTTP deliberados del navegador.
  assert.deepEqual(erroresPagina.filter((e) => !e.includes('503')), []);
  await contexto.close();
} catch (error) {
  resultados.push({ prueba: 'Fallo de ejecución', resultado: 'fallida', detalle: error.message });
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (servidor) servidor.kill();
  await mkdir(evidencias, { recursive: true });
  await writeFile(new URL('resultados.json', evidencias), JSON.stringify({ fecha: new Date().toISOString(), casos: resultados }, null, 2) + '\n');
}
