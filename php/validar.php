<?php
declare(strict_types=1);
require_once __DIR__ . '/catalogo.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $codigo, array $contenido): never
{
    http_response_code($codigo);
    echo json_encode($contenido, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'errores' => ['general' => 'Utilizá POST para validar una solicitud.']]);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    responder(413, ['ok' => false, 'errores' => ['general' => 'La solicitud es demasiado grande.']]);
}

// Validaciones repetidas en servidor: nunca confiar en precios ni totales del cliente.
$errores = [];
$datos = [];
$limites = ['nombre' => 60, 'apellido' => 60, 'correo' => 120, 'telefono' => 25, 'modalidad' => 20, 'fecha' => 10, 'direccion' => 180, 'comentarios' => 500, 'estado' => 20];
foreach ($limites as $campo => $maximo) {
    $valor = $_POST[$campo] ?? '';
    if (!is_string($valor) || !preg_match('//u', $valor)) {
        $errores[$campo] = 'El campo debe contener texto válido.';
        $datos[$campo] = '';
        continue;
    }
    $datos[$campo] = trim($valor);
    $longitud = preg_match_all('/./us', $datos[$campo]);
    if ($longitud > $maximo) $errores[$campo] = "Máximo $maximo caracteres.";
}
foreach (['nombre', 'apellido'] as $campo) {
    if (preg_match_all('/./us', $datos[$campo]) < 2) $errores[$campo] = 'Ingresá al menos dos caracteres.';
}
if (!filter_var($datos['correo'], FILTER_VALIDATE_EMAIL)) $errores['correo'] = 'Ingresá un correo válido.';
if ($datos['telefono'] !== '' && !preg_match('/^[+0-9() .-]{7,25}$/D', $datos['telefono'])) $errores['telefono'] = 'Ingresá un teléfono válido o dejalo vacío.';
if (!in_array($datos['modalidad'], ['retiro', 'domicilio'], true)) $errores['modalidad'] = 'Elegí una modalidad válida.';
if ($datos['modalidad'] === 'domicilio' && preg_match_all('/./us', $datos['direccion']) < 8) $errores['direccion'] = 'Ingresá una dirección de al menos ocho caracteres.';
if ($datos['modalidad'] === 'retiro') $datos['direccion'] = '';
if (!in_array($datos['estado'], ['pendiente', 'en-atencion', 'completada'], true)) $errores['estado'] = 'Elegí un estado válido.';
if (($_POST['terminos'] ?? '') !== '1') $errores['terminos'] = 'Confirmá el carácter temporal de la solicitud.';

$zona = new DateTimeZone('America/Costa_Rica');
$fecha = preg_match('/^\d{4}-\d{2}-\d{2}$/D', $datos['fecha'])
    ? DateTimeImmutable::createFromFormat('!Y-m-d', $datos['fecha'], $zona)
    : false;
$hoy = new DateTimeImmutable('today', $zona);
if (!$fecha || $fecha->format('Y-m-d') !== $datos['fecha'] || $fecha < $hoy) $errores['fecha'] = 'Elegí hoy o una fecha futura válida.';

$itemsTexto = $_POST['items'] ?? '';
try {
    $items = is_string($itemsTexto) ? json_decode($itemsTexto, true, 8, JSON_THROW_ON_ERROR) : null;
} catch (JsonException $excepcion) {
    $items = null;
}
$productos = catalogo();
$normalizados = [];
$vistos = [];
$subtotalCentimos = 0;
if (!is_array($items) || !array_is_list($items) || count($items) < 1 || count($items) > count($productos)) {
    $errores['items'] = 'Agregá al menos un producto válido al carrito.';
} else {
    foreach ($items as $item) {
        if (!is_array($item)) {
            $errores['items'] = 'El carrito contiene un producto inválido.';
            continue;
        }
        $id = $item['productoId'] ?? null;
        $cantidad = $item['cantidad'] ?? null;
        if (!is_string($id) || !isset($productos[$id]) || !is_int($cantidad) || $cantidad < 1 || $cantidad > 20) {
            $errores['items'] = 'Usá productos del catálogo y cantidades enteras entre 1 y 20.';
            continue;
        }
        if (isset($vistos[$id])) {
            $errores['items'] = 'El mismo producto no puede repetirse en el carrito.';
            continue;
        }
        $vistos[$id] = true;
        $precioCentimos = $productos[$id]['precio'] * 100;
        $subtotalCentimos += $precioCentimos * $cantidad;
        $normalizados[] = ['productoId' => $id, 'nombre' => $productos[$id]['nombre'], 'cantidad' => $cantidad, 'precioCentimos' => $precioCentimos];
    }
}
if ($errores) responder(422, ['ok' => false, 'errores' => $errores]);

$impuestoCentimos = (int) round($subtotalCentimos * 13 / 100);
$envioCentimos = $datos['modalidad'] === 'domicilio' ? 250000 : 0;
$datos['items'] = $normalizados;
$datos['totales'] = ['subtotalCentimos' => $subtotalCentimos, 'impuestoCentimos' => $impuestoCentimos, 'envioCentimos' => $envioCentimos, 'totalCentimos' => $subtotalCentimos + $impuestoCentimos + $envioCentimos];
responder(200, ['ok' => true, 'errores' => [], 'datos' => $datos, 'mensaje' => 'Solicitud validada. Sus registros permanecen únicamente en el navegador.']);
