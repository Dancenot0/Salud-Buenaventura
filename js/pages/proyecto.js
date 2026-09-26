/* ============================================================
   SALUD BUENAVENTURA · EL PROYECTO (proyecto.html)
   Página mayormente estática; aquí solo los contadores de la
   banda de metas (se inicializan tras la hidratación del chrome).
   ============================================================ */
(function () {
  "use strict";
  document.addEventListener("sb:ready", function () {
    window.SBUtils.initCounters();
  });
})();
