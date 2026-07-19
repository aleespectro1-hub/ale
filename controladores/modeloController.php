<?php
// ==========================================
// CONTROLADOR DE MODELOS
// ==========================================
// Procesa las peticiones de registrar, editar y eliminar modelos.

require_once __DIR__ . '/../modelos/clase_modelo.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

$objModelo = new Modelo();
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ACCIÓN: REGISTRAR
// ==========================================
if ($accion == 'registrar') {
    $nombre = trim($_POST['nombre_modelo']);
    if ($objModelo->existeNombre($nombre)) {
        header("Location: ../vistas/modelo.php?msg=nombre_duplicado");
        exit();
    }
    $objModelo->registrar($_POST['marca_modelo'], $nombre);
    header("Location: ../vistas/modelo.php?msg=registrado");
    exit();
}

// ==========================================
// ACCIÓN: EDITAR
// ==========================================
if ($accion == 'editar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/modelo.php");
        exit();
    }
    $id = $_POST['id'];
    $nombre = trim($_POST['nombre_modelo']);
    if ($objModelo->existeNombre($nombre, $id)) {
        header("Location: ../vistas/modelo.php?msg=nombre_duplicado");
        exit();
    }
    $objModelo->editar($id, $_POST['marca_modelo'], $nombre);
    header("Location: ../vistas/modelo.php?msg=editado");
    exit();
}

// ==========================================
// ACCIÓN: FILTRAR MODELOS POR MARCA (AJAX)
// ==========================================
if ($accion == 'filtro_marca') {
    $marca_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $modelos = $objModelo->mostrarPorMarca($marca_id);
    header('Content-Type: application/json');
    echo json_encode($modelos);
    exit();
}

// ==========================================
// ACCIÓN: ELIMINAR
// ==========================================
if ($accion == 'eliminar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/modelo.php");
        exit();
    }
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if (!empty($id)) {
        if ($objModelo->tieneBienes($id)) {
            header("Location: ../vistas/modelo.php?msg=asociado");
            exit();
        }
        $objModelo->eliminar($id);
    }
    header("Location: ../vistas/modelo.php?msg=eliminado");
    exit();
} else {
    header("Location: ../vistas/modelo.php");
    exit();
}
?>
