// ============================================
// VALIDACIONES: Menú Lateral
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    // Abrir automaticamente el nav-dropdown que contiene un enlace activo al cargar la pagina
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        const activeLink = dropdown.querySelector('.nav-link.active');
        if (activeLink) {
            dropdown.classList.add('open');
            const submenu = dropdown.querySelector('.sidebar-submenu');
            if (submenu) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        }
    });

    dropdownToggles.forEach(toggle => {
        // Al hacer clic en un toggle, abre o cierra el submenu correspondiente
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parentDropdown = this.closest('.nav-dropdown');
            const submenu = parentDropdown.querySelector('.sidebar-submenu');
            const isOpen = parentDropdown.classList.contains('open');

            // Cierra cualquier otro dropdown abierto (comportamiento tipo acordeon)
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                if (dropdown !== parentDropdown) {
                    dropdown.classList.remove('open');
                    const otherSubmenu = dropdown.querySelector('.sidebar-submenu');
                    if (otherSubmenu) {
                        otherSubmenu.style.maxHeight = null;
                    }
                }
            });

            // Alterna el estado del dropdown actual
            if (isOpen) {
                parentDropdown.classList.remove('open');
                if (submenu) {
                    submenu.style.maxHeight = null;
                }
            } else {
                parentDropdown.classList.add('open');
                if (submenu) {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                }
            }
        });
    });
});
