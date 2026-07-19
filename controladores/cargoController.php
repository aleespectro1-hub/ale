<?php
// ==========================================
// CONTROLADOR DE CARGOS
// ==========================================
// Gestiona las acciones de registrar, editar y eliminar cargos laborales.
// La Secretaria no puede editar ni eliminar registros.
// Se apoya en el modelo clase_cargo.php para las operaciones CRUD.

// Requerimos el Modelo de Cargo. Usamos "__DIR__" para poder llamarlo correctamente y asi poder usarlo.
require_once __DIR__ . '/../modelos/clase_cargo.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

// Instanciamos el objeto de la clase Cargo para tener acceso a los métodos CRUD que creamos en el modelo.
$objCargo = new Cargo();

// Con "$_REQUEST" capturamos la variable 'accion' sin importar si llegó de forma oculta en un formulario (POST) o visible en un enlace (GET).
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ESCENARIO A: REGISTRAR UN NUEVO CARGO
// ==========================================
// Evaluamos si el valor almacenado en la variable $accion es exactamente igual a 'registrar'.
if ($accion == 'registrar') {

    if ($objCargo->existeNombre($_POST['nombre_cargo'])) {
        header("Location: ../vistas/cargo.php?msg=nombre_duplicado");
        exit();
    }

    // Invocamos el método del modelo y le enviamos por orden los datos que el usuario escribió y que viajan en $_POST.
    $objCargo->registrar($_POST['nombre_cargo']);

    // Con la función "header" le ordenamos al navegador web que redireccione físicamente al usuario a la vista del catálogo.
    header("Location: ../vistas/cargo.php?msg=registrado");

    // Detenemos de forma segura e inmediata la ejecución del script actual para asegurar que la redirección sea limpia.
    exit();
}

// ==========================================
// ESCENARIO B: GUARDAR CAMBIOS (ACTUALIZAR)
// ==========================================
// Evaluamos si la variable $accion es igual a 'editar', lo que significa que el usuario alteró campos de un registro existente.
if ($accion == 'editar') {
    // La Secretaria no puede editar registros
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/cargo.php");
        exit();
    }

    $nombre = trim($_POST['nombre_cargo']);
    $id = $_POST['id'];

    if ($objCargo->existeNombre($nombre, $id)) {
        header("Location: ../vistas/cargo.php?msg=nombre_duplicado");
        exit();
    }

    // Ejecutamos el método de actualización del modelo mandando primero el ID oculto del registro y luego los datos modificados del formulario.
    $objCargo->editar($id, $nombre);

    // Redireccionamos al usuario a la pantalla del listado general para que vea sus cambios plasmados de inmediato.
    header("Location: ../vistas/cargo.php?msg=editado");

    // Finalizamos la ejecución del proceso actual en el servidor.
    exit();
}

// ==========================================
// ESCENARIO C: RESTRICCIÓN DE ELIMINACIÓN
// ==========================================
// Evaluamos si la variable $accion corresponde a 'eliminar', acción disparada por el botón de la papelera.
if ($accion == 'eliminar') {
    // La Secretaria no puede eliminar registros
    if ($_SESSION['tip_ses'] === 'Secretaria') {
        header("Location: ../vistas/cargo.php");
        exit();
    }

    // Capturamos de forma segura el ID del cargo que viene adherido a la URL mediante el método GET.
    $id = isset($_GET['id']) ? $_GET['id'] : '';

    if (!empty($id)) {
        if ($objCargo->tieneTrabajadores($id)) {
            header("Location: ../vistas/cargo.php?msg=asociado");
            exit();
        }
        $objCargo->eliminar($id);
    }

    // Refrescamos la pantalla del usuario enviándolo de regreso al catálogo indicando que la acción fue exitosa.
    header("Location: ../vistas/cargo.php?msg=eliminado");

    // Cerramos el flujo del script de manera limpia.
    exit();
} else {
    // Si la acción no coincide con ninguna de las anteriores, enviamos por defecto a la vista principal.
    header("Location: ../vistas/cargo.php");
    exit();
}
?>
