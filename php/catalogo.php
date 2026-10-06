<?php
declare(strict_types=1);

// Configuración fija: no se escriben archivos ni se guardan solicitudes.
// Los IDs/precios deben coincidir con js/datos-iniciales.js (ver pruebas).
function catalogo(): array
{
    return [
        'mantenimiento' => ['nombre' => 'Mantenimiento general', 'precio' => 12900],
        'ajustes' => ['nombre' => 'Frenos y transmisión', 'precio' => 7500],
        'diagnostico' => ['nombre' => 'Diagnóstico', 'precio' => 3500],
        'kit' => ['nombre' => 'Kit de cuidado de bicicleta', 'precio' => 9500],
    ];
}
