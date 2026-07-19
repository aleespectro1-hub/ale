<?php
// ==========================================
// CONTROLADOR DE GRUPOS
// ==========================================
// Procesa las peticiones de registrar, editar y eliminar grupos.
// Verifica permisos según el rol del usuario y redirige a la vista con mensajes.

require_once __DIR__ . '/../modelos/clase_grupo.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

$objGrupo = new Grupo();
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ACCIÓN: REGISTRAR
// ==========================================
if ($accion == 'registrar') {
    $codigo = $_POST['serial_grupo'];
    $nombre = trim($_POST['nombre_grupo']);
    if ($objGrupo->existeCodigo($codigo)) {
        header("Location: ../vistas/grupo.php?msg=duplicado");
        exit();
    }
    if ($objGrupo->existeNombre($nombre)) {
        header("Location: ../vistas/grupo.php?msg=nombre_duplicado");
        exit();
    }
    $objGrupo->registrar($codigo, $nombre);
    header("Location: ../vistas/grupo.php?msg=registrado");
    exit();
}

// ==========================================
// ACCIÓN: EDITAR
// ==========================================
if ($accion == 'editar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/grupo.php");
        exit();
    }
    $id = $_POST['id'];
    $codigo = $_POST['serial_grupo'];
    $nombre = trim($_POST['nombre_grupo']);
    if ($objGrupo->existeCodigo($codigo, $id)) {
        header("Location: ../vistas/grupo.php?msg=duplicado");
        exit();
    }
    if ($objGrupo->existeNombre($nombre, $id)) {
        header("Location: ../vistas/grupo.php?msg=nombre_duplicado");
        exit();
    }
    $objGrupo->editar($id, $codigo, $nombre);
    header("Location: ../vistas/grupo.php?msg=editado");
    exit();
}

// ==========================================
// ACCIÓN: ELIMINAR
// ==========================================
if ($accion == 'eliminar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/grupo.php");
        exit();
    }
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if (!empty($id)) {
        if ($objGrupo->tieneSubgrupos($id)) {
            header("Location: ../vistas/grupo.php?msg=asociado");
            exit();
        }
        $objGrupo->eliminar($id);
    }
    header("Location: ../vistas/grupo.php?msg=eliminado");
    exit();
} else {
    header("Location: ../vistas/grupo.php");
    exit();
}
?>
