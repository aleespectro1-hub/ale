<?php
// ==========================================
// CONTROLADOR DE MARCAS
// ==========================================
// Procesa las peticiones de registrar, editar y eliminar marcas.

require_once __DIR__ . '/../modelos/clase_marca.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

$objMarca = new Marca();
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ACCIÓN: REGISTRAR
// ==========================================
if ($accion == 'registrar') {
    $nombre = trim($_POST['nombre_marca']);
    if ($objMarca->existeNombre($nombre)) {
        header("Location: ../vistas/marca.php?msg=nombre_duplicado");
        exit();
    }
    $objMarca->registrar($nombre);
    header("Location: ../vistas/marca.php?msg=registrado");
    exit();
}

// ==========================================
// ACCIÓN: EDITAR
// ==========================================
if ($accion == 'editar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/marca.php");
        exit();
    }
    $id = $_POST['id'];
    $nombre = trim($_POST['nombre_marca']);
    if ($objMarca->existeNombre($nombre, $id)) {
        header("Location: ../vistas/marca.php?msg=nombre_duplicado");
        exit();
    }
    $objMarca->editar($id, $nombre);
    header("Location: ../vistas/marca.php?msg=editado");
    exit();
}

// ==========================================
// ACCIÓN: ELIMINAR
// ==========================================
if ($accion == 'eliminar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/marca.php");
        exit();
    }
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if (!empty($id)) {
        if ($objMarca->tieneModelos($id)) {
            header("Location: ../vistas/marca.php?msg=asociado");
            exit();
        }
        $objMarca->eliminar($id);
    }
    header("Location: ../vistas/marca.php?msg=eliminado");
    exit();
} else {
    header("Location: ../vistas/marca.php");
    exit();
}
?>
