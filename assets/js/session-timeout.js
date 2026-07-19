// ============================================
// VALIDACIONES: Control de Sesión
// ============================================

(function() {
    var timeoutSeconds = 120;
    var warnSeconds = 20;
    var checkInterval = 1000;

    var lastActivity = Date.now() / 1000;
    var modalShown = false;

    function resetActivity() {
        lastActivity = Date.now() / 1000;
        if (modalShown) {
            hideModal();
        }
    }

    document.addEventListener('click', resetActivity);
    document.addEventListener('keydown', resetActivity);
    document.addEventListener('mousemove', resetActivity);
    document.addEventListener('scroll', resetActivity);

    function checkTimeout() {
        var now = Date.now() / 1000;
        var elapsed = now - lastActivity;
        var remaining = timeoutSeconds - elapsed;

        if (remaining <= 0) {
            window.location.href = '../logout.php';
            return;
        }

        if (remaining <= warnSeconds && !modalShown) {
            showModal(Math.ceil(remaining));
        }

        if (modalShown) {
            updateCountdown(Math.ceil(remaining));
        }
    }

    function showModal(seconds) {
        modalShown = true;
        var modal = document.getElementById('sessionTimeoutModal');
        if (modal) {
            var countdown = modal.querySelector('.session-countdown');
            if (countdown) countdown.textContent = seconds;
            var bsModal = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false });
            bsModal.show();
        }
    }

    function hideModal() {
        if (modalShown) {
            modalShown = false;
            lastActivity = Date.now() / 1000;
            var modal = document.getElementById('sessionTimeoutModal');
            if (modal) {
                var bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            }
        }
    }

    function updateCountdown(seconds) {
        var el = document.querySelector('.session-countdown');
        if (el) el.textContent = seconds;
    }

    window.extendSession = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../ajax/extender_sesion.php', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                hideModal();
            }
        };
        xhr.send();
    };

    window.endSession = function() {
        window.location.href = '../logout.php';
    };

    setInterval(checkTimeout, checkInterval);
})();
