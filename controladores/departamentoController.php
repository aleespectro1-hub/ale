<?php
// ==========================================
// CONTROLADOR DE DEPARTAMENTOS
// ==========================================
// Este archivo recibe las peticiones del usuario (registrar, editar, eliminar)
// enviadas desde la vista departamento.php, procesa la lógica de negocio
// (validaciones, permisos) y se apoya en el modelo `clase_departamento.php`
// para ejecutar las operaciones sobre la base de datos.

// Cargamos el modelo de Departamento para tener acceso a sus métodos CRUD.
require_once __DIR__ . '/../modelos/clase_departamento.php';

// Iniciamos la sesión para poder verificar quién está haciendo la solicitud.
session_start();

// Incluimos el guardian que verifica que el usuario tenga una sesión activa.
require_once __DIR__ . '/../includes/guardian.php';

// Creamos una instancia del modelo para poder ejecutar sus métodos.
$objDepartamento = new Departamento();

// Capturamos la acción (registrar, editar, eliminar) desde $_REQUEST,
// que acepta tanto GET como POST.
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ESCENARIO A: REGISTRAR UN NUEVO DEPARTAMENTO
// ==========================================
// Cuando el usuario llena el formulario de registro y presiona "Guardar",
// los datos llegan por POST con accion=registrar.
if ($accion == 'registrar') {

    $nombre = trim($_POST['nombre_departamento']);

    if ($objDepartamento->existeNombre($nombre)) {
        header("Location: ../vistas/departamento.php?msg=nombre_duplicado");
        exit();
    }

    $objDepartamento->registrar(
        $_POST['organismo_departamento'],
        $nombre,
        $_POST['trabajador_departamento']
    );

    // Redirigimos al listado de departamentos con mensaje de éxito.
    header("Location: ../vistas/departamento.php?msg=registrado");
    exit();
}

// ==========================================
// ESCENARIO B: EDITAR UN DEPARTAMENTO EXISTENTE
// ==========================================
// Cuando el usuario modifica los datos desde el modal de Edición
// y presiona "Actualizar Datos", los datos viajan por POST con accion=editar.
if ($accion == 'editar') {

    // La Secretaria no tiene permiso para modificar departamentos.
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/departamento.php");
        exit();
    }

    $id = $_POST['id'];
    $nombre = trim($_POST['nombre_departamento']);

    if ($objDepartamento->existeNombre($nombre, $id)) {
        header("Location: ../vistas/departamento.php?msg=nombre_duplicado");
        exit();
    }

    $objDepartamento->editar(
        $id,
        $_POST['organismo_departamento'],
        $nombre,
        $_POST['trabajador_departamento']
    );

    // Redirigimos con mensaje de éxito.
    header("Location: ../vistas/departamento.php?msg=editado");
    exit();
}

// ==========================================
// ESCENARIO C: ELIMINAR UN DEPARTAMENTO
// ==========================================
// Cuando el usuario confirma la eliminación desde el modal de Eliminar,
// la acción viaja por GET con accion=eliminar y el id del registro.
if ($accion == 'eliminar') {

    // La Secretaria no puede eliminar registros.
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/departamento.php");
        exit();
    }

    // Capturamos el ID del departamento a eliminar desde la URL (GET).
    $id = isset($_GET['id']) ? $_GET['id'] : '';

    if (!empty($id)) {
        // Si el ID existe, procedemos con la eliminación.
        $objDepartamento->eliminar($id);
        header("Location: ../vistas/departamento.php?msg=eliminado");
        exit();
    }

    // Si no hay ID válido, mostramos un mensaje de restricción.
    header("Location: ../vistas/departamento.php?msg=restringido");
    exit();
}

// Si la acción no coincide con ninguna de las anteriores, redirigimos
// por defecto al listado general de departamentos.
header("Location: ../vistas/departamento.php");
exit();
