<?php
// ==========================================
// CONTROLADOR DE ESTADOS
// ==========================================
// Gestiona las acciones de registrar, editar y eliminar estados (regiones del país).
// La Secretaria no puede editar ni eliminar registros.
// Se apoya en el modelo clase_estado.php para las operaciones CRUD.

// Requerimos el Modelo de Estado. Usamos "__DIR__" para poder llamarlo correctamente y asi poder usarlo.
require_once __DIR__ . '/../modelos/clase_estado.php';
session_start();
require_once __DIR__ . '/../includes/guardian.php';

// Instanciamos el objeto de la clase Estado para tener acceso a los métodos CRUD que creamos en el modelo.
$objEstado = new Estado();

// Con "$_REQUEST" capturamos la variable 'accion' sin importar si llegó de forma oculta en un formulario (POST) o visible en un enlace (GET).
$accion = isset($_REQUEST['accion']) ? $_REQUEST['accion'] : '';

// ==========================================
// ESCENARIO A: REGISTRAR UN NUEVO ESTADO
// ==========================================
// Evaluamos si el valor almacenado en la variable $accion es exactamente igual a 'registrar'.
if ($accion == 'registrar') {

    $nombre = trim($_POST['nbestado']);
    if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/', $nombre)) {
        header("Location: ../vistas/estado.php?msg=nombre_corto");
        exit();
    }

    if ($objEstado->existeNombre($nombre)) {
        header("Location: ../vistas/estado.php?msg=nombre_duplicado");
        exit();
    }
    
    $objEstado->registrar($nombre);
    
    // Con la función "header" le ordenamos al navegador web que redireccione físicamente al usuario a la vista del catálogo.
    header("Location: ../vistas/estado.php?msg=registrado");
    
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
        header("Location: ../vistas/estado.php");
        exit();
    }

    $nombre = trim($_POST['nbestado']);
    if (!preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/', $nombre)) {
        header("Location: ../vistas/estado.php?msg=nombre_corto");
        exit();
    }
    
    $id = $_POST['id'];

    if ($objEstado->existeNombre($nombre, $id)) {
        header("Location: ../vistas/estado.php?msg=nombre_duplicado");
        exit();
    }

    $objEstado->editar($id, $nombre);
    
    // Redireccionamos al usuario a la pantalla del listado general para que vea sus cambios plasmados de inmediato.
    header("Location: ../vistas/estado.php?msg=editado");
    
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
        header("Location: ../vistas/estado.php");
        exit();
    }
    
    // Capturamos de forma segura el ID del estado que viene adherido a la URL mediante el método GET.
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    
    // RESTRICCIÓN: Protegemos la integridad de los datos. Un estado no debe ser eliminado del sistema 
    // para evitar conflictos con tablas dependientes (como los municipios registrados bajo este estado).
    if (!empty($id)) {
        if ($objEstado->tieneMunicipios($id)) {
            header("Location: ../vistas/estado.php?msg=asociado");
            exit();
        }
        $objEstado->eliminar($id);
    }
    
    // Refrescamos la pantalla del usuario enviándolo de regreso al catálogo indicando que la acción fue bloqueada/restringida.
    header("Location: ../vistas/estado.php?msg=eliminado");
    
    // Cerramos el flujo del script de manera limpia.
    exit();
} else {
    // Si la acción no coincide con ninguna de las anteriores, enviamos por defecto a la vista principal.
    header("Location: ../vistas/estado.php");
    exit();
}
?>