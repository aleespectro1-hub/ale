// ============================================
// VALIDACIONES: Login (Index)
// ============================================

function togglePassword(inputId, btn) {
    var input = document.getElementById(inputId);
    var icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    var inputCedula = document.getElementById('cedula');
    var inputClave = document.getElementById('clave');

    // Validar cédula en tiempo real: solo dígitos, 7-8 caracteres
    if (inputCedula) {
        inputCedula.addEventListener('input', function () {
            var val = this.value;
            if (val.length > 0 && (val.length < 7 || val.length > 8)) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            } else if (val.length >= 7 && val.length <= 8) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });
    }

    // Validar al enviar
    if (form) {
        form.addEventListener('submit', function (e) {
            var valido = true;

            // Validar cédula
            if (!inputCedula.value.trim() || inputCedula.value.length < 7 || inputCedula.value.length > 8) {
                inputCedula.classList.add('is-invalid');
                valido = false;
            }

            // Validar contraseña (solo que no esté vacía)
            if (!inputClave.value.trim()) {
                inputClave.classList.add('is-invalid');
                valido = false;
            }

            // Validar rol
            var rol = document.getElementById('rol');
            if (!rol.value) {
                rol.classList.add('is-invalid');
                valido = false;
            }

            if (!valido) {
                e.preventDefault();
                mostrarAlerta('alert-warning','Error de validaci&oacute;n','Corrige los campos marcados en rojo.');
            }
        });
    }
});
