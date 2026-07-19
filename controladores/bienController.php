<?php
// ==========================================
// CONTROLADOR DE BIENES
// ==========================================
// Procesa las peticiones de registrar, editar, eliminar y cambiar estatus de bienes.

require_once __DIR__ . '/../modelos/clase_bien.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

$objBien = new Bien();
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

if ($accion == 'registrar') {
    $serial = trim($_POST['serial_bien']);
    $nombre = trim($_POST['nombre_bien']);

    if ($objBien->existeSerial($serial)) {
        header("Location: ../vistas/bienes.php?msg=serial_duplicado");
        exit();
    }

    if ($objBien->existeNombre($nombre)) {
        header("Location: ../vistas/bienes.php?msg=nombre_duplicado");
        exit();
    }

    $objBien->registrar(
        $serial,
        $nombre,
        $_POST['marca_id'],
        $_POST['modelo_id'],
        $_POST['grupo_id'],
        $_POST['subgrupo_id'],
        $_POST['cantidad'],
        $_POST['descripcion'],
        $_POST['fecha_ingreso']
    );
    header("Location: ../vistas/bienes.php?msg=registrado");
    exit();
}

if ($accion == 'editar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/bienes.php");
        exit();
    }

    $id = $_POST['id_bien'];
    $serial = trim($_POST['serial_bien']);
    $nombre = trim($_POST['nombre_bien']);

    if ($objBien->existeSerial($serial, $id)) {
        header("Location: ../vistas/bienes.php?msg=serial_duplicado");
        exit();
    }

    if ($objBien->existeNombre($nombre, $id)) {
        header("Location: ../vistas/bienes.php?msg=nombre_duplicado");
        exit();
    }

    $objBien->editar(
        $id,
        $serial,
        $nombre,
        $_POST['marca_id'],
        $_POST['modelo_id'],
        $_POST['grupo_id'],
        $_POST['subgrupo_id'],
        $_POST['cantidad'],
        $_POST['descripcion'],
        $_POST['fecha_ingreso']
    );
    header("Location: ../vistas/bienes.php?msg=editado");
    exit();
}

if ($accion == 'eliminar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/bienes.php");
        exit();
    }
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if (!empty($id)) {
        $objBien->eliminar($id);
    }
    header("Location: ../vistas/bienes.php?msg=eliminado");
    exit();
}

if ($accion == 'activar' || $accion == 'inactivar') {
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/bienes.php");
        exit();
    }
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    $estatus = ($accion == 'activar') ? 1 : 0;
    if (!empty($id)) {
        $objBien->cambiarEstatus($id, $estatus);
    }
    $msg = ($accion == 'activar') ? 'activado' : 'inactivado';
    header("Location: ../vistas/bienes.php?msg=$msg");
    exit();
}

header("Location: ../vistas/bienes.php");
exit();
