<?php
// ==========================================
// CONTROLADOR DE CAMBIO DE CLAVE
// ==========================================
// Procesa el formulario de cambio de contraseña.
// Valida la clave actual, el formato (8-12 chars, mayúscula, minúscula, número, especial)
// y que la confirmación coincida. Si todo es correcto, actualiza la clave,
// desactiva forzar_cambio y destruye la sesión para forzar un nuevo inicio de sesión.
// Acceso: Usuarios autenticados (sesión activa).

session_start();

require_once __DIR__ . '/../modelos/clase_usuario.php';
require_once __DIR__ . '/../includes/guardian.php';

$usuario = new Usuario();
$datos_usuario = $usuario->buscarUsuarioPorId($_SESSION['id_ses']);

$clave_actual = $_POST['clave_actual'] ?? '';
$nueva_clave  = $_POST['nueva_clave'] ?? '';
$confirmar    = $_POST['confirmar_clave'] ?? '';

// Validar que la clave actual coincida.
if (!password_verify($clave_actual, $datos_usuario['clave'])) {
    header("Location: ../vistas/cambiar_clave.php?error=actual_incorrecta");
    exit();
}

// Validar que la nueva clave no esté vacía.
if (empty($nueva_clave)) {
    header("Location: ../vistas/cambiar_clave.php?error=vacia");
    exit();
}

// Validar el formato de la nueva clave (8-12 chars, mayúscula, minúscula, número, especial).
$pattern = '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:\'\\\\|,.<>\/?]).{8,12}$/';
if (!preg_match($pattern, $nueva_clave)) {
    header("Location: ../vistas/cambiar_clave.php?error=formato_invalido");
    exit();
}

// Validar que coincidan.
if ($nueva_clave !== $confirmar) {
    header("Location: ../vistas/cambiar_clave.php?error=no_coinciden");
    exit();
}

// ==========================================
// ACTUALIZAR CLAVE Y CERRAR SESIÓN
// ==========================================
// Ejecuta la actualización en la base de datos; si tiene éxito,
// destruye la sesión y redirige al login para que el usuario inicie con la nueva clave.
if ($usuario->cambiarClave($_SESSION['id_ses'], $nueva_clave)) {
    session_destroy();
    header("Location: ../index.php?error=clave_cambiada");
    exit();
} else {
    header("Location: ../vistas/cambiar_clave.php?error=sistema");
    exit();
}
