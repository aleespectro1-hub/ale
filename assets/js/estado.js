function validarNombre(input) {
    var val = input.value.trim();
    if (val.length === 0) { input.classList.remove('is-valid', 'is-invalid'); return false; }
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(val)) {
        input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
    } else {
        input.classList.remove('is-valid'); input.classList.add('is-invalid'); return false;
    }
}

function formValido(form) {
    var ok = true;
    form.querySelectorAll('input, select, textarea').forEach(function(el) {
        var name = el.getAttribute('name');
        if (name === 'nbestado' && !validarNombre(el)) ok = false;
        if (el.hasAttribute('required') && el.value.trim() === '') ok = false;
    });
    return ok;
}

function actualizarBoton(form) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (formValido(form)) {
        btn.removeAttribute('disabled');
    } else {
        btn.setAttribute('disabled', 'disabled');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.form-estado');
    forms.forEach(function(form) {
        var nombreInput = form.querySelector('input[name="nbestado"]');
        if (nombreInput) {
            nombreInput.addEventListener('input', function() {
                validarNombre(this);
                actualizarBoton(form);
            });
        }
        form.addEventListener('submit', function(e) {
            var valido = true;
            form.querySelectorAll('input, select, textarea').forEach(function(el) {
                var name = el.getAttribute('name');
                if (name === 'nbestado' && !validarNombre(el)) valido = false;
                if (el.hasAttribute('required') && el.value.trim() === '') valido = false;
            });
            if (!valido) e.preventDefault();
        });
        actualizarBoton(form);
    });
});
