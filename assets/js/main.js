// ============================================
// VALIDACIONES: Funciones Globales
// ============================================

"use strict";

// Funcion principal autoejecutable (IIFE) para evitar contaminar el ambito global
(function () {
  // Claves para almacenar el estado del sidebar y el tema en localStorage
  var sidebarStorageKey = "adminHMD.sidebarMini";
  var themeStorageKey = "adminHMD.colorTheme";
  // Media query para detectar pantallas de escritorio (>= 992px)
  var desktopMedia = "(min-width: 992px)";

  // Ejecuta el callback cuando el DOM este completamente cargado
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  // Devuelve true si la pantalla actual cumple con el tamano de escritorio
  function isDesktop() {
    return window.matchMedia(desktopMedia).matches;
  }

  // Verifica si localStorage esta disponible en el navegador
  function canUseStorage() {
    try {
      var testKey = sidebarStorageKey + ".test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtiene el estado guardado del sidebar mini desde localStorage
  function getSavedMiniState(storageAvailable) {
    if (!storageAvailable) {
      return false;
    }

    return window.localStorage.getItem(sidebarStorageKey) === "true";
  }

  // Guarda el estado actual del sidebar mini en localStorage
  function saveMiniState(storageAvailable, isMini) {
    if (storageAvailable) {
      window.localStorage.setItem(sidebarStorageKey, String(isMini));
    }
  }

  // Al cargar el DOM, se inicializan todas las funcionalidades de la interfaz
  onReady(function () {
    var body = document.body;
    var sidebarToggle = document.querySelector("[data-sidebar-toggle]");
    var closeButtons = document.querySelectorAll("[data-sidebar-close]");
    var sidebarLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    var mediaQuery = window.matchMedia(desktopMedia);
    var storageAvailable = canUseStorage();

    // ==========================================
    // VALIDACION DE FORMULARIOS (Bootstrap)
    // ==========================================
    // Agrega la clase 'was-validated' a formularios con .needs-validation al enviarlos
    function initValidation() {
      var forms = document.querySelectorAll(".needs-validation");

      Array.prototype.forEach.call(forms, function (form) {
        form.addEventListener("submit", function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        });
      });
    }

    // ==========================================
    // BUSQUEDA EN TABLAS (filtro por texto)
    // ==========================================
    // Filtra filas de una tabla segun el texto ingresado en un input con data-table-search
    function initTableSearch() {
      var searchInputs = document.querySelectorAll("[data-table-search]");

      Array.prototype.forEach.call(searchInputs, function (input) {
        var tableId = input.getAttribute("data-table-search");
        var table = document.getElementById(tableId);

        if (!table) {
          return;
        }

        input.addEventListener("input", function () {
          var query = input.value.trim().toLowerCase();
          var rows = table.querySelectorAll("tbody tr");

          // Oculta las filas que no coinciden con la busqueda
          Array.prototype.forEach.call(rows, function (row) {
            if (row.hasAttribute("data-empty-row")) return;
            var match = query === "" || row.textContent.toLowerCase().indexOf(query) !== -1;
            row.hidden = !match;
            row.setAttribute("data-filtered", match ? "false" : "true");
          });

          // Reaplica la paginacion despues de filtrar
          applyPagination(table);
        });
      });
    }

    // ==========================================
    // MODO OSCURO FORZADO
    // ==========================================
    // Aplica el tema oscuro al documento y lo guarda en localStorage
    function forceDarkMode() {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.setAttribute("data-bs-theme", "dark");

      if (storageAvailable) {
        window.localStorage.setItem(themeStorageKey, "dark");
      }
    }

    // ==========================================
    // RESETEO DE MODALES
    // ==========================================
    // Al cerrar un modal, resetea el formulario y quita la validacion
    function initModalReset() {
      document.addEventListener('hidden.bs.modal', function (event) {
        var form = event.target.querySelector('form');
        if (form) {
          form.reset();
          form.classList.remove('was-validated');
        }
      });
    }

    // ==========================================
    // PAGINACION DE TABLAS
    // ==========================================
    // Crea controles de paginacion para tablas con atributo data-pagination
    function initPagination() {
      var tables = document.querySelectorAll("table[data-pagination]");
      Array.prototype.forEach.call(tables, function (table) {
        var perPage = parseInt(table.getAttribute("data-pagination")) || 10;
        var wrapper = table.parentElement;
        // Crea los elementos HTML para los controles de paginacion
        var controls = document.createElement("div");
        controls.className = "pagination-controls d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3";
        controls.style.cssText = "font-size:0.875rem;";
        controls.innerHTML =
          '<div class="d-flex align-items-center gap-2">' +
            '<span class="text-muted pagination-info">Mostrando <strong class="pagination-from">0</strong>-<strong class="pagination-to">0</strong> de <strong class="pagination-total">0</strong></span>' +
          '</div>' +
          '<div class="d-flex align-items-center gap-2">' +
            '<div class="form-check form-switch mb-0">' +
              '<input class="form-check-input pagination-show-all" type="checkbox" id="showAll_' + table.id + '">' +
              '<label class="form-check-label text-muted" for="showAll_' + table.id + '">Mostrar todos</label>' +
            '</div>' +
            '<nav aria-label="Paginaci&oacute;n">' +
              '<ul class="pagination pagination-sm mb-0">' +
                '<li class="page-item pagination-prev disabled"><button class="page-link" type="button">&laquo; Anterior</button></li>' +
                '<li class="page-item pagination-next disabled"><button class="page-link" type="button">Siguiente &raquo;</button></li>' +
              '</ul>' +
            '</nav>' +
          '</div>';
        wrapper.appendChild(controls);

        var showAllCheck = controls.querySelector(".pagination-show-all");
        var prevBtn = controls.querySelector(".pagination-prev");
        var nextBtn = controls.querySelector(".pagination-next");
        var infoFrom = controls.querySelector(".pagination-from");
        var infoTo = controls.querySelector(".pagination-to");
        var infoTotal = controls.querySelector(".pagination-total");

        // Almacena el estado de paginacion en la tabla
        table._pag = { page: 0, perPage: perPage, showAll: false, controls: controls, infoFrom: infoFrom, infoTo: infoTo, infoTotal: infoTotal };

        // Eventos de los botones de paginacion
        prevBtn.addEventListener("click", function () { if (!prevBtn.classList.contains("disabled")) { table._pag.page--; applyPagination(table); } });
        nextBtn.addEventListener("click", function () { if (!nextBtn.classList.contains("disabled")) { table._pag.page++; applyPagination(table); } });
        showAllCheck.addEventListener("change", function () { table._pag.showAll = showAllCheck.checked; table._pag.page = 0; applyPagination(table); });

        applyPagination(table);
      });
    }

    // Aplica la paginacion: muestra solo las filas de la pagina actual
    function applyPagination(table) {
      var pag = table._pag;
      if (!pag) return;
      // Obtiene todas las filas visibles (no vacias)
      var rows = [];
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (r) {
        if (!r.hasAttribute("data-empty-row")) rows.push(r);
      });

      var visible = rows.filter(function (r) { return r.getAttribute("data-filtered") !== "true" && !r.hidden; });
      var total = visible.length;

      pag.infoTotal.textContent = total;

      // Si se selecciono "mostrar todos" o hay pocas filas, muestra todo
      if (pag.showAll || total <= pag.perPage) {
        pag.page = 0;
        Array.prototype.forEach.call(visible, function (r, i) { r.style.display = ""; });
        pag.infoFrom.textContent = total > 0 ? 1 : 0;
        pag.infoTo.textContent = total;
        pag.controls.querySelector(".pagination-prev").classList.add("disabled");
        pag.controls.querySelector(".pagination-next").classList.add("disabled");
        return;
      }

      var maxPage = Math.ceil(total / pag.perPage) - 1;
      if (pag.page < 0) pag.page = 0;
      if (pag.page > maxPage) pag.page = maxPage;

      var from = pag.page * pag.perPage;
      var to = Math.min(from + pag.perPage, total);

      // Muestra solo las filas del rango de la pagina actual
      Array.prototype.forEach.call(visible, function (r, i) {
        r.style.display = (i >= from && i < to) ? "" : "none";
      });

      pag.infoFrom.textContent = total > 0 ? from + 1 : 0;
      pag.infoTo.textContent = to;

      var prev = pag.controls.querySelector(".pagination-prev");
      var next = pag.controls.querySelector(".pagination-next");
      prev.classList.toggle("disabled", pag.page === 0);
      next.classList.toggle("disabled", pag.page >= maxPage);
    }

    // Inicializa todas las funcionalidades al cargar la pagina
    initValidation();
    initTableSearch();
    forceDarkMode();
    initModalReset();
    initPagination();



    // ==========================================
    // SIDEBAR: Alternancia (toggle)
    // ==========================================
    // Si no hay un boton toggle, sale de la funcion
    if (!sidebarToggle) {
      return;
    }

    // Agrega o quita una clase CSS segun el estado booleano
    function setClass(element, className, enabled) {
      if (enabled) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }

    // Actualiza el atributo aria-expanded del boton toggle segun el estado del sidebar
    function setToggleExpanded() {
      var expanded = isDesktop()
        ? !body.classList.contains("sidebar-mini")
        : body.classList.contains("sidebar-open");

      sidebarToggle.setAttribute("aria-expanded", String(expanded));
    }

    // Cierra el sidebar en dispositivos moviles
    function closeMobileSidebar() {
      body.classList.remove("sidebar-open");
      setToggleExpanded();
    }

    // Alterna el sidebar: modo mini en desktop, modo abierto/cerrado en movil
    function toggleSidebar() {
      if (isDesktop()) {
        body.classList.toggle("sidebar-mini");
        saveMiniState(storageAvailable, body.classList.contains("sidebar-mini"));
      } else {
        body.classList.toggle("sidebar-open");
      }

      setToggleExpanded();
    }

    // Agrega manejadores para cerrar el sidebar movil al hacer clic en elementos
    function addCloseHandlers(items) {
      Array.prototype.forEach.call(items, function (item) {
        item.addEventListener("click", function () {
          if (!isDesktop()) {
            closeMobileSidebar();
          }
        });
      });
    }

    // Restaura el estado mini del sidebar desde localStorage al cargar la pagina
    if (getSavedMiniState(storageAvailable) && isDesktop()) {
      body.classList.add("sidebar-mini");
    }

    // Evento principal: clic en el boton toggle del sidebar
    sidebarToggle.addEventListener("click", toggleSidebar);
    // Cierra el sidebar al hacer clic en botones de cierre o enlaces del menu
    addCloseHandlers(closeButtons);
    addCloseHandlers(sidebarLinks);
    setToggleExpanded();

    // ==========================================
    // SIDEBAR: Cambio de tamano de pantalla
    // ==========================================
    // Ajusta el sidebar cuando la pantalla cambia entre desktop y movil
    function handleBreakpointChange() {
      if (isDesktop()) {
        body.classList.remove("sidebar-open");
        setClass(body, "sidebar-mini", getSavedMiniState(storageAvailable));
      } else {
        body.classList.remove("sidebar-mini");
      }

      setToggleExpanded();
    }

    // Escucha cambios en el media query (responsive)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleBreakpointChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleBreakpointChange);
    }
  });
})();
