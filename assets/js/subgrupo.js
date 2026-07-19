document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        var alertNode = document.querySelector('.alert');
        if (alertNode) {
            var alert = new bootstrap.Alert(alertNode);
            alert.close();
        }
    }, 4000);
});
