function mostrarAlerta(tipo, mensaje, texto) {
    if (typeof Swal !== 'undefined') {
        var icon = 'info';
        if (tipo === 'alert-success') icon = 'success';
        else if (tipo === 'alert-danger') icon = 'error';
        else if (tipo === 'alert-warning') icon = 'warning';
        var opts = {
            icon: icon,
            title: mensaje,
            showConfirmButton: false,
            timer: 3000,
            background: '#2d2d2d',
            color: '#e0e0e0'
        };
        if (texto) opts.text = texto;
        Swal.fire(opts);
    } else {
        alert((texto ? texto + '\n' : '') + mensaje);
    }
}
