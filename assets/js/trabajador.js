// ============================================
// VALIDACIONES: Formulario de Trabajador
// ============================================

// Valida que la cedula tenga entre 7 y 8 digitos numericos
function validarCedula(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (/^\d{7,8}$/.test(val)) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

// Valida que el telefono tenga exactamente 10 digitos numericos
function validarTelefono(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (/^\d{10}$/.test(val)) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

// Valida que el nombre o apellido tenga al menos 4 caracteres alfabeticos (incluye acentos y ñ)
function validarNombreApellido(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(val)) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

// Valida que el correo electronico tenga un formato valido
function validarCorreo(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

// Valida que la direccion tenga al menos 10 caracteres
function validarDireccion(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (val.length >= 10) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

// Valida que el estado y municipio esten seleccionados
function validarSelect(input) {
    var val = input.value.trim();
    if (val === '') {
        input.classList.remove('is-valid', 'is-invalid'); return false;
    } else {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    }
}

// Carga los municipios de un estado via AJAX y llena el select de municipios
function cargarMunicipios(estadoId, selectMunicipio, selectedId) {
    // Si no hay estado seleccionado, limpiamos el select
    if (!estadoId || estadoId === '') {
        selectMunicipio.innerHTML = '<option value="">Primero seleccione un estado...</option>';
        return;
    }
    // Mostramos estado de carga mientras llega la respuesta del servidor
    selectMunicipio.innerHTML = '<option value="">Cargando municipios...</option>';
    // Petición AJAX al endpoint que devuelve municipios en JSON
    fetch('../ajax/get_municipios.php?estado_id=' + encodeURIComponent(estadoId))
        .then(function(response) { return response.json(); })
        .then(function(data) {
            // Construimos las opciones del select dinámicamente
            var html = '<option value="">Seleccione un municipio...</option>';
            data.forEach(function(m) {
                // Si hay un selectedId (edición), marcamos la opción correspondiente
                var sel = (selectedId && String(m.id) === String(selectedId)) ? ' selected' : '';
                html += '<option value="' + m.id + '"' + sel + '>' + m.nombmunicipio + '</option>';
            });
            selectMunicipio.innerHTML = html;
        })
        .catch(function() {
            // En caso de error de red o servidor, mostramos mensaje informativo
            selectMunicipio.innerHTML = '<option value="">Error al cargar municipios</option>';
        });
}

// Configura la carga dinamica de municipios al cambiar el estado
function configurarCargaMunicipios(form) {
    // Obtenemos los selects de estado y municipio dentro del formulario actual
    var selectEstado = form.querySelector('select[name="estado_trabajador"]');
    var selectMunicipio = form.querySelector('select[name="municipio_trabajador"]');
    // Si no existen estos selects en este formulario (ej. otro tipo de form), salimos
    if (!selectEstado || !selectMunicipio) return;

    // Al cambiar el estado, cargamos los municipios correspondientes (sin pre-selección)
    selectEstado.addEventListener('change', function() {
        var selectedId = null;
        cargarMunicipios(this.value, selectMunicipio, selectedId);
    });

    // Si es un modal de edicion y ya tiene un estado preseleccionado, cargamos sus municipios
    // usando el atributo data-selected para pre-seleccionar el municipio guardado
    if (selectEstado.value !== '') {
        var selectedMun = selectMunicipio.getAttribute('data-selected');
        cargarMunicipios(selectEstado.value, selectMunicipio, selectedMun);
    }
}

// Redirige la validacion al campo especifico segun su atributo 'name'
function validarCampo(input) {
    if (!input) return true;
    var name = input.getAttribute('name');
    if (name === 'cedula_trabajador' && !input.readOnly) return validarCedula(input);
    if (name === 'telefono_trabajador') return validarTelefono(input);
    if (name === 'nombre_trabajador') return validarNombreApellido(input);
    if (name === 'apellido_trabajador') return validarNombreApellido(input);
    if (name === 'correo_trabajador') return validarCorreo(input);
    if (name === 'direccion_trabajador') return validarDireccion(input);
    if (name === 'estado_trabajador' || name === 'municipio_trabajador') return validarSelect(input);
    return true;
}

// Verifica si todos los campos del formulario son validos
function formValido(form) {
    var ok = true;
    form.querySelectorAll('input, select, textarea').forEach(function(el) {
        if (!validarCampo(el)) ok = false;
    });
    return ok;
}

// Valida todos los campos al enviar el formulario y enfoca el primer error
function validarFormSubmit(form) {
    var ok = true;
    var primerError = null;
    form.querySelectorAll('input, select, textarea').forEach(function(el) {
        var val = el.value.trim();
        var req = el.hasAttribute('required') && val === '';
        if (!validarCampo(el) || req) {
            if (!primerError) primerError = el;
            ok = false;
            el.classList.add('is-invalid');
        }
    });
    if (primerError) primerError.focus();
    return ok;
}

// Habilita o deshabilita el boton de envio segun si el formulario es valido
function actualizarBoton(form) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (formValido(form)) {
        btn.removeAttribute('disabled');
    } else {
        btn.setAttribute('disabled', 'disabled');
    }
}

// Al cargar el DOM, configura eventos de validacion en tiempo real para todos los formularios de trabajador
document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.form-trabajador');
    forms.forEach(function(form) {
        // Configuramos la carga dinamica de municipios segun el estado seleccionado
        configurarCargaMunicipios(form);
        form.querySelectorAll('input, select, textarea').forEach(function(el) {
            el.addEventListener('input', function() {
                validarCampo(this);
                actualizarBoton(form);
            });
            el.addEventListener('change', function() {
                validarCampo(this);
                actualizarBoton(form);
            });
        });
        form.addEventListener('submit', function(e) {
            if (!validarFormSubmit(this)) e.preventDefault();
        });
        actualizarBoton(form);
    });
});
