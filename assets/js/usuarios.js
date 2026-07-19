// ============================================
// VALIDACIONES: Usuarios
// ============================================

function togglePassword(inputEl, btn) {
    if (typeof inputEl === 'string') inputEl = document.getElementById(inputEl);
    var icon = btn.querySelector('i');
    if (inputEl.type === 'password') {
        inputEl.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        inputEl.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

var inputBuscar = document.getElementById('buscarTrabajador');
var inputIdTrabajador = document.getElementById('id_trabajador');
var inputCedula = document.getElementById('cedula');
var inputClave = document.getElementById('clave');
var resultadosDiv = document.getElementById('resultadosTrabajador');

// ==========================================
// RESETEAR BÚSQUEDA AL CERRAR MODAL
// ==========================================
var modalRegistrar = document.getElementById('modalRegistrar');
if (modalRegistrar) {
    modalRegistrar.addEventListener('hidden.bs.modal', function () {
        if (resultadosDiv) resultadosDiv.classList.add('d-none');
        if (inputBuscar) inputBuscar.classList.remove('is-valid', 'is-invalid');
    });
}

// ==========================================
// BÚSQUEDA DINÁMICA DE TRABAJADOR
// ==========================================
function buscarTrabajadores(termino) {
    if (!Array.isArray(trabajadores)) return [];
    termino = termino.toLowerCase();
    return trabajadores.filter(function (t) {
        var cedula = String(t.cedula || '').toLowerCase();
        var nombre = String(t.nombre || '').toLowerCase();
        var apellido = String(t.apellido || '').toLowerCase();
        return cedula.indexOf(termino) > -1 || nombre.indexOf(termino) > -1 || apellido.indexOf(termino) > -1;
    });
}

if (inputBuscar && resultadosDiv) {
    inputBuscar.addEventListener('input', function () {
        var termino = this.value.trim();
        resultadosDiv.innerHTML = '';
        inputIdTrabajador.value = '';
        inputCedula.value = '';

        if (termino.length < 1) {
            resultadosDiv.classList.add('d-none');
            return;
        }

        var filtrados = buscarTrabajadores(termino);

        if (filtrados.length === 0) {
            resultadosDiv.innerHTML = '<button type="button" class="list-group-item list-group-item-action disabled" tabindex="-1">Sin resultados</button>';
            resultadosDiv.classList.remove('d-none');
            return;
        }

        filtrados.forEach(function (t) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'list-group-item list-group-item-action';
            item.textContent = t.cedula + ' - ' + t.nombre + ' ' + t.apellido;
            item.addEventListener('click', function () {
                inputIdTrabajador.value = t.id;
                inputCedula.value = t.cedula;
                inputBuscar.value = t.cedula + ' - ' + t.nombre + ' ' + t.apellido;
                resultadosDiv.classList.add('d-none');
                inputBuscar.classList.remove('is-invalid');
                inputBuscar.classList.add('is-valid');
            });
            resultadosDiv.appendChild(item);
        });

        resultadosDiv.classList.remove('d-none');
    });

    document.addEventListener('click', function (e) {
        if (!inputBuscar.contains(e.target) && !resultadosDiv.contains(e.target)) {
            resultadosDiv.classList.add('d-none');
        }
    });
}

// ==========================================
// VALIDACIÓN AL ENVIAR EL FORMULARIO
// ==========================================
var form = document.getElementById('formUsuario');
if (form) {
    form.addEventListener('submit', function (e) {
        var valido = true;

        if (!inputIdTrabajador.value) {
            inputBuscar.classList.add('is-invalid');
            valido = false;
        }

        if (!inputCedula.value.trim()) {
            inputCedula.classList.add('is-invalid');
            valido = false;
        }

        var req = this.querySelectorAll('input[required], select[required]');
        for (var i = 0; i < req.length; i++) {
            if (req[i].value.trim() === '') {
                req[i].classList.add('is-invalid');
                valido = false;
            } else {
                req[i].classList.remove('is-invalid');
            }
        }

        if (!valido) {
            e.preventDefault();
                mostrarAlerta('alert-warning','Error de validaci&oacute;n','Corrige los campos marcados en rojo.');
        }
    });
}
