<?php
    // Definimos una clase llamada "Conexion" para agrupar toda la lógica de acceso a la base de datos.
    class Conexion {
        
        // Propiedad privada y estática para almacenar el servidor donde vive la base de datos (habitualmente localhost).
        private static $host = "localhost";
        
        // Propiedad privada y estática con el nombre exacto de la base de datos que creamos en MySQL.
        private static $db_name = "sistema_bienesfundey";
        
        // Propiedad privada y estática con el usuario administrador por defecto de MySQL (root), en este caso es "admin" porque es el usuario que se creo para manejar la base de datos.
        private static $usuario = "root";
        
        // Propiedad privada y estática para la contraseña. En Windows va vacía en caso de que no hayan creado un usuario con su contraseña, en Linux (LAMP) lleva la clave que asignaron al momento de la instalación.
        private static $password = ""; 

        // Método público y estático que utilizaremos para levantar y obtener el puente de conexión en cualquier parte del sistema.
        public static function conectar() {
            
            // Iniciamos un bloque "try" (intentar) para capturar de forma segura cualquier falla que ocurra al conectar.
            try {
                
                // Creamos una nueva instancia de la clase PDO (PHP Data Objects) pasándole la ruta de MySQL, las credenciales y la guardamos en $cn.
                $cn = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$db_name, self::$usuario, self::$password);
                
                // Le ordenamos a PDO que si ocurre un problema con el SQL, active el modo de alertas levantando "Excepciones" (errores detallados).
                $cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                // Ejecutamos una instrucción directa en el servidor para forzar el juego de caracteres UTF-8 (evita errores con acentos y eñes).
                $cn->exec("set names utf8");
                
                // Si todo salió bien hasta aquí, el método devuelve ($return) la conexión activa lista para ser usada por los modelos.
                return $cn;
                
            // Si algo falla en el bloque "try", el bloque "catch" atrapa el error específico de la base de datos (PDOException) y lo guarda en $e.
            } catch (PDOException $e) {
                
                // Detiene inmediatamente la ejecución de toda la página web (die) y muestra en pantalla un mensaje personalizado con el error real.
                die("Error crítico de conexión: " . $e->getMessage());
            }
        }
    }
?>