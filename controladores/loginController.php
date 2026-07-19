<?php
// ==========================================
// CONTROLADOR DE INICIO DE SESIÓN
// ==========================================
// Procesa el formulario de autenticación del usuario.
// Valida cédula, rol y contraseña contra la base de datos.
// Si todo es correcto, inicializa las variables de sesión.
// Si el usuario debe forzar cambio de clave, redirige a la vista correspondiente.
// Acceso: Público (sin sesión previa requerida).

// Requerimos la conexión para poder consultar la base de datos.
require_once __DIR__ . '/../config/conexion.php';

// Iniciamos la sesión para poder almacenar los datos del usuario autenticado.
session_start();

// Capturamos los datos que el usuario escribió en el formulario de inicio de sesión.
$cedula = isset($_POST['cedula']) ? trim($_POST['cedula']) : '';
$rol = isset($_POST['rol']) ? $_POST['rol'] : '';
$clave = isset($_POST['clave']) ? $_POST['clave'] : '';

// Verificamos que todos los campos no estén vacíos antes de proceder.
if (empty($cedula) || empty($rol) || empty($clave)) {
    header("Location: ../index.php?error=campos_vacios");
    exit();
}

try {
    // Obtenemos una conexión a la base de datos.
    $cn = Conexion::conectar();

    // Consultamos el usuario en la tabla "usuarios" filtrando por la cédula.
    $sql = "SELECT u.*, r.nombre, r.apellido
            FROM usuarios u
            INNER JOIN trabajadores r ON u.id_trabajador = r.id
            WHERE r.cedula = ?";
    $stmt = $cn->prepare($sql);
    $stmt->execute([$cedula]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Si no se encontró ningún registro con esa cédula, el usuario no existe.
    if (!$usuario) {
        header("Location: ../index.php?error=credenciales");
        exit();
    }

    // Verificamos que el usuario esté activo en el sistema.
    if ($usuario['estatus'] !== 'Activo') {
        header("Location: ../index.php?error=inactivo");
        exit();
    }

    // Verificamos que la contraseña ingresada coincida con el hash almacenado.
    if (!password_verify($clave, $usuario['clave'])) {
        header("Location: ../index.php?error=credenciales");
        exit();
    }

    // Verificamos que el rol seleccionado coincida con el rol del usuario.
    if ($usuario['rol'] !== $rol) {
        header("Location: ../index.php?error=rol_incorrecto");
        exit();
    }

    // ==========================================
    // INICIO DE SESIÓN EXITOSO
    // ==========================================
    // Almacenamos en la sesión los datos necesarios para el resto del sistema.
    $_SESSION['id_ses']   = $usuario['id_usuario'];
    $_SESSION['usu_ses']  = $usuario['usuario'];
    $_SESSION['tip_ses']  = $usuario['rol'];
    $_SESSION['nom_ses']  = $usuario['nombre'] . ' ' . $usuario['apellido'];
    $_SESSION['ci_ses']   = $cedula;
    $_SESSION['id_trabajador'] = $usuario['id_trabajador'];
    $_SESSION['ultimo_acceso'] = time();
    $_SESSION['forzar_cambio'] = $usuario['forzar_cambio'];

    // Verificamos si debe cambiar la clave (primer inicio o restablecida por admin).
    if (!empty($usuario['forzar_cambio'])) {
        header("Location: ../vistas/cambiar_clave.php");
        exit();
    }

    // Redireccionamos al panel principal del sistema.
    header("Location: ../vistas/menu.php");
    exit();

} catch (PDOException $e) {
    // Si ocurre un error de base de datos, redireccionamos con un mensaje genérico.
    header("Location: ../index.php?error=sistema");
    exit();
}
?>
