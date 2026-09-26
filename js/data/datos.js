/* ============================================================
   SALUD BUENAVENTURA · DATOS CENTRALIZADOS
   ------------------------------------------------------------
   Fuente única de verdad del prototipo. En producción, este
   módulo se reemplaza por una API (ver docs/BIBLIA.md §6.4).

   ⚠ GOBIERNO DE DATOS: las fichas con `verificado: false` son
   datos ilustrativos del prototipo y se muestran con badge
   "Por verificar". Los datos marcados `verificado: true`
   provienen de fuentes públicas (sitio oficial del hospital,
   líneas nacionales de emergencia). Toda ficha registra
   `actualizado` (ISO) para trazabilidad.

   Convención de horarios:
     horarios: [{ dias:[0-6 (0=dom)], abre:"HH:MM", cierra:"HH:MM" }]
     urgencias24: true → urgencias permanentes.
   ============================================================ */
(function (global) {
  "use strict";

  const L_V = [1, 2, 3, 4, 5];            // lunes a viernes
  const L_S = [1, 2, 3, 4, 5, 6];         // lunes a sábado
  const L_D = [0, 1, 2, 3, 4, 5, 6];      // todos los días

  /* ============================================================
     CATÁLOGO DE SERVICIOS (taxonomía central)
     ============================================================ */
  const servicios = [
    { id: "urgencias-24",       nombre: "Urgencias 24 h",              grupo: "Asistencial",  icono: "siren",           desc: "Atención inmediata de urgencias, todos los días del año." },
    { id: "consulta-externa",   nombre: "Consulta externa",            grupo: "Asistencial",  icono: "stethoscope",     desc: "Consulta médica general programada o por demanda." },
    { id: "pediatria",          nombre: "Pediatría",                   grupo: "Asistencial",  icono: "baby",            desc: "Atención de niñas, niños y adolescentes." },
    { id: "materna",            nombre: "Atención materna y perinatal",grupo: "Asistencial",  icono: "heart-pulse",     desc: "Control prenatal, parto institucional y puericultura." },
    { id: "salud-mental",       nombre: "Salud mental",                grupo: "Asistencial",  icono: "brain",           desc: "Psicología, psiquiatría y espacios de escucha comunitaria." },
    { id: "odontologia",        nombre: "Odontología",                 grupo: "Asistencial",  icono: "tooth",           desc: "Consulta, limpieza, restauración y cirugía bucal." },
    { id: "vacunacion",         nombre: "Vacunación (PAI)",            grupo: "Asistencial",  icono: "syringe",         desc: "Esquema nacional de vacunación para todas las edades." },
    { id: "farmacia",           nombre: "Farmacia y dispensación",     grupo: "Asistencial",  icono: "pill",            desc: "Entrega de medicamentos y fórmulas médicas." },
    { id: "hospitalizacion",    nombre: "Hospitalización",             grupo: "Asistencial",  icono: "bed",             desc: "Camas de internación general y especializada." },
    { id: "cirugia",            nombre: "Cirugía y procedimientos",    grupo: "Asistencial",  icono: "firstaid",        desc: "Cirugía general y procedimientos menores programados." },
    { id: "prehospitalaria",    nombre: "Atención prehospitalaria",    grupo: "Asistencial",  icono: "activity",        desc: "Primeros auxilios y apoyo en emergencias en terreno." },
    { id: "promocion",          nombre: "Promoción y prevención",      grupo: "Asistencial",  icono: "shield-check",    desc: "Jornadas educativas, tamizajes y prevención de la enfermedad." },
    { id: "telemedicina",       nombre: "Telemedicina",                grupo: "Asistencial",  icono: "video",           desc: "Consulta remota y teleorientación por videollamada." },
    { id: "referencia",         nombre: "Referencia y traslado",       grupo: "Asistencial",  icono: "route",           desc: "Remisión a instituciones de mayor complejidad y transporte asistencial." },
    { id: "laboratorio",        nombre: "Laboratorio clínico",         grupo: "Diagnóstico",  icono: "microscope",      desc: "Toma de muestras y análisis clínicos." },
    { id: "imagenologia",       nombre: "Imagenología",                grupo: "Diagnóstico",  icono: "scan",            desc: "Rayos X, ecografía y apoyo diagnóstico por imagen." },
    { id: "afiliacion-eps",     nombre: "Afiliación y trámites EPS",   grupo: "Administrativo",icono: "clipboard-list", desc: "Afiliación, traslado, actualización de datos y certificados." },
    { id: "autorizaciones",     nombre: "Autorizaciones y remisiones", grupo: "Administrativo",icono: "file-text",      desc: "Trámite de autorizaciones de servicios y órdenes médicas." },
    { id: "atencion-ciudadana", nombre: "Atención al ciudadano",       grupo: "Administrativo",icono: "headphones",     desc: "Peticiones, quejas, reclamos y orientación institucional." }
  ];

  const servicioById = (id) => servicios.find((s) => s.id === id);

  /* ============================================================
     INSTITUCIONES (directorio centralizado)
     ============================================================ */
  const ips = [
    {
      id: "hospital-luis-ablanque",
      nombre: "Hospital Distrital Luis Ablanque de la Plata",
      sigla: "HDLAB",
      tipo: "Hospital público (ESE)",
      nivel: "Nivel II",
      entidad: "E.S.E. Hospital Distrital Luis Ablanque de la Plata",
      direccion: "Av. Simón Bolívar 17-40, Barrio El Jorge",
      zona: "Zona urbana · Barrio El Jorge",
      zonaGrupo: "Centro",
      telefono: "+57 315 547 6004",
      whatsapp: "+573155476004",
      email: "contacto@hospitalluisablanque.gov.co",
      web: "https://www.hospitalluisablanque.gov.co/",
      horarios: [
        { dias: L_V, abre: "07:00", cierra: "16:00", nota: "Consulta externa y administración" },
        { dias: [6], abre: "08:00", cierra: "12:00", nota: "Consulta externa (sábados)" }
      ],
      urgencias24: true,
      notaHorario: "Servicio de urgencias y hospitalización operativo las 24 h, los 365 días.",
      servicios: ["urgencias-24", "consulta-externa", "pediatria", "materna", "cirugia", "hospitalizacion", "laboratorio", "imagenologia", "odontologia", "farmacia", "vacunacion", "referencia"],
      requisitos: [
        "Documento de identidad original (registro civil para menores de edad).",
        "Carné o certificado de afiliación a la EPS (si aplica).",
        "Para urgencias: no se exige ningún documento previo; la atención es inmediata."
      ],
      descripcion: "Hospital público de referencia del Distrito, cabecera de la red local de salud. Presta servicios de nivel I y II de complejidad, urgencias permanentes y coordina las brigadas fluviales hacia los corregimientos.",
      verificado: true, actualizado: "2026-09-20", destacado: true
    },
    {
      id: "buque-benkos-bioho",
      nombre: "Buque Hospital «Benkós Biohó»",
      sigla: "BHB",
      tipo: "Unidad móvil fluvial",
      nivel: "Atención primaria itinerante",
      entidad: "E.S.E. Hospital Distrital Luis Ablanque de la Plata",
      direccion: "Zarpa desde el casco urbano · rutas por ríos y costa del Distrito",
      zona: "Itinerante · corregimientos ribereños",
      zonaGrupo: "Itinerante",
      telefono: "+57 315 547 6004",
      whatsapp: "+573155476004",
      email: "contacto@hospitalluisablanque.gov.co",
      web: "https://www.hospitalluisablanque.gov.co/",
      horarios: [
        { dias: [2, 3, 4], abre: "08:00", cierra: "16:00", nota: "Según programación mensual de rutas" }
      ],
      urgencias24: false,
      notaHorario: "Las rutas se programan por brigadas mensuales. Confirme la parada más cercana llamando al call center del hospital.",
      servicios: ["consulta-externa", "odontologia", "vacunacion", "laboratorio", "salud-mental", "promocion", "telemedicina"],
      requisitos: [
        "Consultar previamente la programación mensual de la brigada.",
        "Documento de identidad.",
        "Carné de vacunas (para jornadas de vacunación)."
      ],
      descripcion: "Unidad hospitalaria fluvial que lleva atención primaria, odontología, vacunación y telemedicina a los corregimientos ribereños y de costa del Distrito, cerrando la brecha de acceso en las zonas más apartadas.",
      verificado: true, actualizado: "2026-09-18", destacado: true
    },
    {
      id: "clinica-del-puerto",
      nombre: "Clínica del Puerto",
      sigla: "CDP",
      tipo: "Clínica privada",
      nivel: "Nivel II",
      entidad: "Clínica del Puerto S.A.S. (demo)",
      direccion: "Calle 2 # 3-45, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 1234",
      whatsapp: "+573201234567",
      email: "info@clinicadelpuerto.demo",
      web: "",
      horarios: [
        { dias: L_V, abre: "07:00", cierra: "18:00", nota: "Consulta externa" }
      ],
      urgencias24: true,
      notaHorario: "Urgencias 24 h. Consulta externa con cita previa.",
      servicios: ["urgencias-24", "consulta-externa", "laboratorio", "imagenologia", "hospitalizacion", "cirugia", "pediatria", "farmacia"],
      requisitos: [
        "Documento de identidad.",
        "Carné de EPS o disposición de pago particular.",
        "Orden médica para procedimientos programados."
      ],
      descripcion: "Institución privada de mediana complejidad con servicio de urgencias permanente, apoyo diagnóstico por imagen y hospitalización. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-10", destacado: true
    },
    {
      id: "centro-salud-cascajal",
      nombre: "Centro de Salud Cascajal",
      sigla: "CSC",
      tipo: "Centro de salud (ESE)",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Carrera 3 # 2-18, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 2345",
      email: "",
      web: "",
      horarios: [
        { dias: L_V, abre: "07:00", cierra: "16:00", nota: "Jornada continua" },
        { dias: [6], abre: "08:00", cierra: "12:00", nota: "Solo urgencias menores y vacunación" }
      ],
      urgencias24: false,
      servicios: ["consulta-externa", "vacunacion", "promocion", "odontologia", "farmacia", "laboratorio", "materna"],
      requisitos: ["Documento de identidad.", "Carné de vacunas para jornadas PAI."],
      descripcion: "Puerta de entrada de la red pública en el centro del Distrito: atención primaria, vacunación permanente y control prenatal. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-10"
    },
    {
      id: "puesto-rio-mar",
      nombre: "Puesto de Salud Río Mar",
      sigla: "PSRM",
      tipo: "Puesto de salud",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Calle 7 # 28-10, Barrio Río Mar",
      zona: "Zona urbana · Comuna norte",
      zonaGrupo: "Urbana norte",
      telefono: "+57 602 240 3456",
      email: "",
      web: "",
      horarios: [{ dias: L_V, abre: "08:00", cierra: "15:00", nota: "Jornada continua" }],
      urgencias24: false,
      servicios: ["consulta-externa", "vacunacion", "promocion", "farmacia"],
      requisitos: ["Documento de identidad."],
      descripcion: "Atención primaria para los barrios del norte del Distrito, con énfasis en promoción, prevención y vacunación. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-05"
    },
    {
      id: "puesto-viento-libre",
      nombre: "Puesto de Salud Viento Libre",
      sigla: "PSVL",
      tipo: "Puesto de salud",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Carrera 54 # 6-32, Barrio Viento Libre",
      zona: "Zona urbana · Comuna sur",
      zonaGrupo: "Urbana sur",
      telefono: "+57 602 240 4567",
      email: "",
      web: "",
      horarios: [{ dias: L_V, abre: "07:30", cierra: "15:30", nota: "Jornada continua" }],
      urgencias24: false,
      servicios: ["consulta-externa", "vacunacion", "promocion", "odontologia"],
      requisitos: ["Documento de identidad."],
      descripcion: "Punto de atención primaria de la comuna sur; apoya las jornadas barriales de prevención y el esquema PAI. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-05"
    },
    {
      id: "centro-salud-independencia",
      nombre: "Centro de Salud La Independencia",
      sigla: "CSLI",
      tipo: "Centro de salud (ESE)",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Calle 12 # 50-05, Barrio La Independencia",
      zona: "Zona urbana · Comuna sur",
      zonaGrupo: "Urbana sur",
      telefono: "+57 602 240 5678",
      email: "",
      web: "",
      horarios: [
        { dias: L_V, abre: "07:00", cierra: "16:00", nota: "Jornada continua" },
        { dias: [6], abre: "08:00", cierra: "12:00", nota: "Vacunación y PyP" }
      ],
      urgencias24: false,
      servicios: ["consulta-externa", "materna", "pediatria", "vacunacion", "laboratorio", "farmacia", "promocion"],
      requisitos: ["Documento de identidad.", "Carné de vacunas (menores de edad)."],
      descripcion: "Centro de primer nivel con programa de control prenatal y crecimiento y desarrollo para la población infantil de la comuna sur. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-05"
    },
    {
      id: "nueva-eps-centro",
      nombre: "Nueva EPS · Punto de atención Centro",
      sigla: "NEPS",
      tipo: "Punto EPS",
      nivel: "Administrativo",
      entidad: "Nueva EPS (demo de punto local)",
      direccion: "Calle 1 # 4-20, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 601 307 7066",
      email: "",
      web: "https://www.nuevaeps.co/",
      horarios: [{ dias: L_V, abre: "08:00", cierra: "16:00", nota: "Atención al afiliado" }],
      urgencias24: false,
      servicios: ["afiliacion-eps", "autorizaciones", "atencion-ciudadana"],
      requisitos: ["Documento de identidad original.", "Para traslado: certificado de la EPS anterior (si aplica)."],
      descripcion: "Punto presencial de afiliación, autorizaciones y atención al afiliado. Los canales nacionales (web y telefónico) atienden los mismos trámites sin desplazamiento. Ficha de punto local ilustrativa.",
      verificado: false, actualizado: "2026-09-08"
    },
    {
      id: "salud-total-eps",
      nombre: "Salud Total EPS-S · Punto Buenaventura",
      sigla: "STEPS",
      tipo: "Punto EPS",
      nivel: "Administrativo",
      entidad: "Salud Total EPS-S (demo de punto local)",
      direccion: "Av. Simón Bolívar # 8-40, local 3",
      zona: "Zona urbana · Centro",
      zonaGrupo: "Centro",
      telefono: "+57 601 437 1010",
      email: "",
      web: "https://saludtotal.com.co/",
      horarios: [{ dias: L_V, abre: "08:00", cierra: "16:30", nota: "Atención al afiliado" }],
      urgencias24: false,
      servicios: ["afiliacion-eps", "autorizaciones", "atencion-ciudadana"],
      requisitos: ["Documento de identidad original."],
      descripcion: "Atención al afiliado del régimen subsidiado y contributivo: afiliaciones, traslados, autorizaciones y PQRS. Ficha de punto local ilustrativa.",
      verificado: false, actualizado: "2026-09-08"
    },
    {
      id: "emssanar-eps",
      nombre: "Emssanar EPS-S · Punto de atención",
      sigla: "EMSS",
      tipo: "Punto EPS",
      nivel: "Administrativo",
      entidad: "Emssanar EPS-S (demo de punto local)",
      direccion: "Carrera 4 # 3-15, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 731 8080",
      email: "",
      web: "",
      horarios: [{ dias: L_V, abre: "08:00", cierra: "15:30", nota: "Atención al afiliado" }],
      urgencias24: false,
      servicios: ["afiliacion-eps", "autorizaciones", "atencion-ciudadana"],
      requisitos: ["Documento de identidad original."],
      descripcion: "Punto de atención al afiliado de EPS del régimen subsidiado con presencia en el Pacífico. Ficha de punto local ilustrativa.",
      verificado: false, actualizado: "2026-09-08"
    },
    {
      id: "laboratorio-del-puerto",
      nombre: "Laboratorio Clínico del Puerto",
      sigla: "LCP",
      tipo: "Laboratorio clínico",
      nivel: "Apoyo diagnóstico",
      entidad: "Laboratorio del Puerto S.A.S. (demo)",
      direccion: "Calle 2 # 5-31, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 6789",
      whatsapp: "+573161234567",
      email: "resultados@labpuerto.demo",
      horarios: [
        { dias: L_V, abre: "06:00", cierra: "16:00", nota: "Toma de muestras hasta las 10:00" },
        { dias: [6], abre: "06:30", cierra: "11:00", nota: "Toma de muestras" }
      ],
      urgencias24: false,
      notaHorario: "Entrega de resultados por correo electrónico o ventanilla en 24–48 h.",
      servicios: ["laboratorio"],
      requisitos: ["Orden médica vigente.", "Ayuno de 8 h para química sanguínea (según examen).", "Documento de identidad."],
      descripcion: "Toma de muestras y procesamiento de exámenes de rutina y especializados con entrega digital de resultados. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-02"
    },
    {
      id: "cruz-roja-buenaventura",
      nombre: "Cruz Roja Colombiana · Seccional Buenaventura",
      sigla: "CRC",
      tipo: "Organismo de socorro",
      nivel: "Prehospitalario",
      entidad: "Cruz Roja Colombiana",
      direccion: "Barrio Cascajal (sede seccional)",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "132",
      email: "",
      web: "https://www.cruzrojacolombiana.org/",
      horarios: [{ dias: L_D, abre: "00:00", cierra: "23:59", nota: "Atención de emergencias" }],
      urgencias24: false,
      notaHorario: "La línea 132 opera de forma permanente para emergencias y atención prehospitalaria.",
      servicios: ["prehospitalaria", "promocion", "referencia"],
      requisitos: ["Ninguno para emergencias."],
      descripcion: "Organismo de socorro con capacidad de atención prehospitalaria, primeros auxilios comunitarios y apoyo en emergencias y desastres en el Distrito.",
      verificado: true, actualizado: "2026-09-12"
    },
    {
      id: "secretaria-salud-distrital",
      nombre: "Secretaría de Salud Pública Distrital",
      sigla: "SSPD",
      tipo: "Entidad pública",
      nivel: "Rectoría sectorial",
      entidad: "Alcaldía Distrital de Buenaventura",
      direccion: "Edificio CAM, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 0080",
      email: "salud@buenaventura.gov.co",
      web: "https://www.buenaventura.gov.co/",
      horarios: [{ dias: L_V, abre: "08:00", cierra: "12:00" }, { dias: L_V, abre: "14:00", cierra: "17:30" }],
      urgencias24: false,
      notaHorario: "Radicación de PQRS y vigilancia sanitaria en horario de oficina.",
      servicios: ["atencion-ciudadana", "promocion", "vacunacion"],
      requisitos: ["Documento de identidad para radicar PQRS.", "Soportes del caso (si los hay)."],
      descripcion: "Autoridad sanitaria del Distrito: rectoría, vigilancia y control, salud pública, campañas de vacunación y atención de peticiones ciudadanas.",
      verificado: true, actualizado: "2026-09-15"
    },
    {
      id: "centro-salud-mental",
      nombre: "Centro Comunitario de Salud Mental",
      sigla: "CCSM",
      tipo: "Centro comunitario",
      nivel: "Atención psicosocial",
      entidad: "Programa comunitario con apoyo de cooperación internacional (demo)",
      direccion: "Calle 5 # 12-40, Barrio San Jorge",
      zona: "Zona urbana · Barrio El Jorge",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 7890",
      whatsapp: "+573171234567",
      email: "escucha@saludmental.demo",
      horarios: [
        { dias: L_V, abre: "08:00", cierra: "17:00", nota: "Escucha y psicología" },
        { dias: [6], abre: "08:00", cierra: "13:00", nota: "Grupos comunitarios" }
      ],
      urgencias24: false,
      servicios: ["salud-mental", "telemedicina", "promocion"],
      requisitos: ["No se exige afiliación a EPS para el espacio de escucha inicial.", "Documento de identidad para remisión clínica."],
      descripcion: "Espacio de escucha, orientación psicosocial y telemedicina en salud mental para la población del Distrito, inspirado en las experiencias de telemedicina comunitaria del territorio.",
      verificado: false, actualizado: "2026-09-01"
    },
    {
      id: "ips-odontologica-sonrisa",
      nombre: "IPS Odontológica Sonrisa Pacífica",
      sigla: "IOSP",
      tipo: "IPS especializada",
      nivel: "Odontología",
      entidad: "Sonrisa Pacífica IPS (demo)",
      direccion: "Calle 1 # 6-12, Barrio Cascajal",
      zona: "Zona urbana · Centro (Cascajal)",
      zonaGrupo: "Centro",
      telefono: "+57 602 240 8901",
      whatsapp: "+573181234567",
      email: "",
      horarios: [
        { dias: L_V, abre: "08:00", cierra: "18:00", nota: "Con cita previa" },
        { dias: [6], abre: "08:00", cierra: "13:00", nota: "Con cita previa" }
      ],
      urgencias24: false,
      servicios: ["odontologia"],
      requisitos: ["Cita previa por teléfono o WhatsApp.", "Documento de identidad."],
      descripcion: "Consulta odontológica general, estética y cirugía bucal sencilla con cita previa. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-02"
    },
    {
      id: "puesto-merizalde",
      nombre: "Puesto de Salud Puerto Merizalde (Río Raposo)",
      sigla: "PSPM",
      tipo: "Puesto de salud rural",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Corregimiento Puerto Merizalde, Río Raposo",
      zona: "Zona rural · Río Raposo",
      zonaGrupo: "Rural ríos",
      telefono: "+57 315 547 6004",
      email: "",
      web: "",
      horarios: [{ dias: [1, 3, 5], abre: "08:00", cierra: "14:00", nota: "Días de atención con profesional" }],
      urgencias24: false,
      notaHorario: "Primeros auxilios con personal comunitario fuera del horario; remisión por vía fluvial al hospital distrital en emergencias.",
      servicios: ["consulta-externa", "vacunacion", "promocion", "prehospitalaria"],
      requisitos: ["Documento de identidad."],
      descripcion: "Punto de atención primaria del río Raposo. Las emergencias se estabilizan en el puesto y se remiten por vía fluvial o por el Buque Hospital. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-03"
    },
    {
      id: "puesto-juanchaco",
      nombre: "Punto de Salud Juanchaco–Ladrilleros",
      sigla: "PSJL",
      tipo: "Puesto de salud rural",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Corregimiento de Juanchaco, costa pacífica",
      zona: "Zona rural · Juanchaco–Ladrilleros",
      zonaGrupo: "Rural costa",
      telefono: "+57 315 547 6004",
      email: "",
      web: "",
      horarios: [{ dias: [2, 4], abre: "08:00", cierra: "14:00", nota: "Días de atención con profesional" }],
      urgencias24: false,
      notaHorario: "Brigadas de refuerzo del Buque Hospital según programación mensual.",
      servicios: ["consulta-externa", "vacunacion", "promocion", "materna", "prehospitalaria"],
      requisitos: ["Documento de identidad.", "Carné de control prenatal (gestantes)."],
      descripcion: "Atención primaria para los corregimientos de la costa pacífica, con apoyo de brigadas itinerantes y énfasis en salud materna. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-03"
    },
    {
      id: "puesto-cajambre",
      nombre: "Puesto de Salud Cajambre",
      sigla: "PSCJ",
      tipo: "Puesto de salud rural",
      nivel: "Nivel I",
      entidad: "Red pública ESE (demo)",
      direccion: "Corregimiento de Cajambre, zona rural",
      zona: "Zona rural · Río Cajambre",
      zonaGrupo: "Rural ríos",
      telefono: "+57 315 547 6004",
      email: "",
      web: "",
      horarios: [{ dias: [3, 5], abre: "08:00", cierra: "13:00", nota: "Días de atención con profesional" }],
      urgencias24: false,
      servicios: ["consulta-externa", "vacunacion", "promocion"],
      requisitos: ["Documento de identidad."],
      descripcion: "Punto de atención primaria del río Cajambre; coordina con brigadas fluviales y con la red de promotores comunitarios. Ficha ilustrativa del prototipo.",
      verificado: false, actualizado: "2026-09-03"
    }
  ];

  /* ============================================================
     TRÁMITES GUIADOS
     ============================================================ */
  const tramites = [
    {
      id: "afiliacion-eps",
      titulo: "Afiliarse a una EPS",
      categoria: "Afiliación",
      resumen: "Elija su EPS y afíliese al régimen subsidiado o contributivo, en línea o en punto presencial.",
      entidad: "EPS de su elección · Sisbén (subsidiado)",
      duracion: "1 día hábil (en línea) · inmediato en punto",
      costo: "Gratuito",
      canales: ["Presencial (puntos EPS)", "Web de la EPS", "Telefónico"],
      pasos: [
        { t: "Verifique su estado actual", d: "Consulte en ADRES (adres.gov.co) si ya está afiliado y a qué EPS pertenece." },
        { t: "Elija la EPS disponible en el Distrito", d: "Compare puntos de atención y red de IPS en el directorio de esta plataforma." },
        { t: "Reúna los documentos", d: "Documento de identidad y, para régimen subsidiado, clasificación Sisbén vigente." },
        { t: "Radique la afiliación", d: "En el punto de atención, la web o la línea de la EPS elegida." },
        { t: "Confirme la novedad", d: "A los 5 días hábiles vuelva a consultar ADRES para verificar que la afiliación quedó activa." }
      ],
      requisitos: ["Documento de identidad original", "Clasificación Sisbén (régimen subsidiado)", "Certificado laboral o de ingresos (contributivo, si aplica)"],
      tip: "La afiliación es gratuita. Ningún intermediario puede cobrar por este trámite."
    },
    {
      id: "traslado-eps",
      titulo: "Trasladarse de EPS",
      categoria: "Afiliación",
      resumen: "Cámbiese de EPS cuando lo desee cumpliendo las reglas de permanencia, sin perder la continuidad.",
      entidad: "EPS origen y EPS destino",
      duracion: "Efectivo el primer día del segundo mes siguiente a la solicitud",
      costo: "Gratuito",
      canales: ["Web de la EPS destino", "Presencial (puntos EPS)", "Telefónico"],
      pasos: [
        { t: "Revise su tiempo de afiliación", d: "Por regla general se exige un periodo mínimo de permanencia en la EPS actual (consulte excepciones por insatisfacción o traslado de municipio)." },
        { t: "Solicite el traslado en la EPS destino", d: "Puede hacerlo en línea o en el punto de atención; no necesita autorización de su EPS actual." },
        { t: "Verifique la novedad en ADRES", d: "Confirme la fecha efectiva del traslado y conserve el soporte." },
        { t: "Actualice su red de atención", d: "Revise en el directorio los puntos y la red de IPS de su nueva EPS en Buenaventura." }
      ],
      requisitos: ["Documento de identidad", "Estar afiliado y activo en el sistema"],
      tip: "Mientras se efectúa el traslado, su EPS actual debe seguir prestando los servicios."
    },
    {
      id: "cita-medica",
      titulo: "Solicitar una cita médica",
      categoria: "Atención",
      resumen: "Agende por los canales oficiales de su EPS o IPS: línea telefónica, WhatsApp, web o presencial.",
      entidad: "Su EPS o la IPS asignada",
      duracion: "Según disponibilidad de agenda",
      costo: "Según plan de beneficios (copagos según régimen)",
      canales: ["Telefónico (call center EPS)", "WhatsApp / app de la EPS", "Presencial", "Web"],
      pasos: [
        { t: "Identifique la IPS que le corresponde", d: "Consulte su red en el directorio filtrando por su zona y EPS." },
        { t: "Tenga a mano sus datos", d: "Documento de identidad, número de afiliado y motivo de consulta." },
        { t: "Agende por el canal disponible", d: "Guarde el número de radicado o confirmación de la cita." },
        { t: "Llegue con anticipación", d: "15 minutos antes, con documento original y la orden médica si la requiere." }
      ],
      requisitos: ["Documento de identidad", "Estar afiliado a una EPS (salvo población especial)"],
      tip: "Si no le dan cita oportuna, puede presentar queja ante la Supersalud (01 8000 51 37 00)."
    },
    {
      id: "consulta-adres",
      titulo: "Consultar su afiliación (ADRES)",
      categoria: "Verificación",
      resumen: "Verifique gratis y en línea si está afiliado al sistema de salud y a qué EPS pertenece.",
      entidad: "ADRES · Ministerio de Salud",
      duracion: "Inmediato",
      costo: "Gratuito",
      canales: ["Web (adres.gov.co → BDUA)"],
      pasos: [
        { t: "Ingrese a adres.gov.co", d: "Sección BDUA · Consulta de afiliados." },
        { t: "Digite su documento", d: "Tipo y número de documento; acepte los términos." },
        { t: "Revise el resultado", d: "Estado (activo o retirado), régimen y EPS a la que pertenece." }
      ],
      requisitos: ["Número de documento de identidad"],
      tip: "Si aparece «no afiliado», inicie el trámite de afiliación para no perder el acceso a servicios."
    },
    {
      id: "sisben",
      titulo: "Solicitar o actualizar el Sisbén IV",
      categoria: "Afiliación",
      resumen: "La encuesta clasifica su hogar para acceder al régimen subsidiado y a programas sociales.",
      entidad: "Oficina Sisbén Distrital",
      duracion: "Hasta 15 días hábiles desde la encuesta",
      costo: "Gratuito",
      canales: ["Presencial (oficina Sisbén)", "Web (sisben.gov.co)"],
      pasos: [
        { t: "Solicite la encuesta", d: "En la oficina Sisbén del Distrito o por la web oficial; puede pedir inclusión, retiro o actualización." },
        { t: "Reciba la visita", d: "Un encuestador visitará su vivienda con identificación oficial." },
        { t: "Consulte su grupo", d: "En sisben.gov.co con su documento: los grupos A, B o C definen el acceso al subsidiado." }
      ],
      requisitos: ["Documentos de identidad de todo el hogar", "Recibo de servicio público del domicilio", "Estar presente en la vivienda al momento de la visita"],
      tip: "El Sisbén no es una EPS: es la clasificación que le permite afiliarse al régimen subsidiado."
    },
    {
      id: "vacunacion-pai",
      titulo: "Vacunarse (esquema PAI)",
      categoria: "Atención",
      resumen: "Vacunas gratuitas para todas las edades en puestos de salud, el hospital y brigadas móviles.",
      entidad: "Red pública · Secretaría de Salud Distrital",
      duracion: "Inmediato (sin cita en puntos de vacunación)",
      costo: "Gratuito",
      canales: ["Presencial (puestos de salud y brigadas)"],
      pasos: [
        { t: "Ubique el punto más cercano", d: "Filtre el directorio por «Vacunación (PAI)» y su zona." },
        { t: "Lleve el carné de vacunación", d: "Si no lo tiene, en el punto le expiden uno nuevo sin costo." },
        { t: "Reciba la vacuna y verifique el registro", d: "Confirme que queden anotadas dosis, lote y fecha." }
      ],
      requisitos: ["Documento de identidad", "Carné de vacunación (si lo tiene)"],
      tip: "En zonas rurales, pregunte por las brigadas del Buque Hospital «Benkós Biohó»."
    },
    {
      id: "certificado-nacimiento",
      titulo: "Registro civil y certificado de nacido vivo",
      categoria: "Certificados",
      resumen: "Trámite para recién nacidos en instituciones de salud del Distrito.",
      entidad: "IPS del parto · Notaría o Registraduría",
      duracion: "El certificado se expide al egreso; el registro, inmediato en notaría",
      costo: "Certificado: sin costo en la IPS · Registro civil: gratuito",
      canales: ["Presencial (IPS y notaría/registraduría)"],
      pasos: [
        { t: "Solicite el certificado de nacido vivo", d: "La IPS donde ocurrió el parto lo entrega al egreso." },
        { t: "Registre al recién nacido", d: "En notaría o registraduría dentro del mes siguiente, con el certificado y documentos de los padres." },
        { t: "Afílie a la EPS", d: "Con el registro civil, afilie al bebé como beneficiario (recién nacidos tienen cobertura desde el nacimiento)." }
      ],
      requisitos: ["Certificado de nacido vivo", "Documentos de identidad de los padres", "Copia del registro civil para la afiliación"],
      tip: "El recién nacido queda cubierto por la EPS de la madre desde el nacimiento, aun antes del registro."
    },
    {
      id: "transporte-especializado",
      titulo: "Traslado intermunicipal por referencia médica",
      categoria: "Atención",
      resumen: "Cuando el caso requiere especialidades no disponibles en el Distrito (p. ej. Cali).",
      entidad: "EPS del afiliado · IPS remitente",
      duracion: "Según prioridad clínica; urgente: inmediato",
      costo: "Cubierto por la EPS (incluye acompañante en menores y casos justificados)",
      canales: ["Por la IPS tratante (orden de remisión)"],
      pasos: [
        { t: "Obtenga la orden de remisión", d: "El médico tratante define la necesidad y el nivel de complejidad requerido." },
        { t: "La IPS gestiona la aceptación", d: "La institución remitente contacta a la EPS y a la IPS receptora." },
        { t: "Confirme el transporte", d: "La EPS debe garantizar el traslado (terrestre, fluvial o aéreo según el caso) y el retorno." },
        { t: "Solicite viáticos si aplica", d: "Paciente y acompañante pueden requerir apoyo de transporte y estadía: pregunte a su EPS y a la Secretaría de Salud." }
      ],
      requisitos: ["Orden de remisión firmada", "Documento de identidad", "Historia clínica resumida"],
      tip: "Si la EPS se niega o demora el traslado urgente, acuda a la Supersalud o a una tutela; en urgencias vitales prima la atención."
    },
    {
      id: "queja-supersalud",
      titulo: "Presentar queja o reclamo (Supersalud)",
      categoria: "Verificación",
      resumen: "Cuando la EPS o IPS no garantiza la atención, existe un canal nacional gratuito de protección.",
      entidad: "Superintendencia Nacional de Salud",
      duracion: "Radicación inmediata · respuesta según el caso (urgencias: prioridad)",
      costo: "Gratuito",
      canales: ["Telefónico (01 8000 51 37 00)", "Web (supersalud.gov.co)", "Presencial"],
      pasos: [
        { t: "Reúna los soportes", d: "Fechas, radicados, nombres de quien atendió y documentos relacionados." },
        { t: "Radique la queja", d: "Por la línea gratuita nacional o el formulario web de la Supersalud." },
        { t: "Haga seguimiento", d: "Conserve el número de radicado; la entidad debe responder en los plazos legales." }
      ],
      requisitos: ["Documento de identidad", "Relato claro de los hechos con fechas", "Soportes (si los tiene)"],
      tip: "Para riesgo de vida, la queja se tramita con prioridad y puede pedir medidas especiales de protección."
    }
  ];

  /* ============================================================
     LÍNEAS DE EMERGENCIA (números oficiales nacionales/locales)
     ============================================================ */
  const lineas = [
    { numero: "123", nombre: "Línea Única de Emergencias", desc: "Número nacional integrado: policía, ambulancias y bomberos. Opera 24/7 y es gratuito desde cualquier operador.", tipo: "emergencia", disponible: "24 h · 7 días" },
    { numero: "125", nombre: "Urgencias médicas · CRUE Valle", desc: "Centro Regulador de Urgencias y Emergencias del Valle del Cauca: coordina ambulancias y la referencia hospitalaria.", tipo: "emergencia", disponible: "24 h · 7 días" },
    { numero: "132", nombre: "Cruz Roja Colombiana", desc: "Atención prehospitalaria, primeros auxilios y apoyo en emergencias y desastres en el Distrito.", tipo: "emergencia", disponible: "24 h · 7 días" },
    { numero: "119", nombre: "Cuerpo de Bomberos", desc: "Incendios, rescates y emergencias con materiales peligrosos.", tipo: "emergencia", disponible: "24 h · 7 días" },
    { numero: "144", nombre: "Defensa Civil Colombiana", desc: "Apoyo en emergencias colectivas, desastres y eventos masivos.", tipo: "emergencia", disponible: "24 h · 7 días" },
    { numero: "01 8000 51 37 00", nombre: "Superintendencia de Salud", desc: "Línea nacional gratuita para proteger su derecho a la salud: quejas contra EPS e IPS y orientación al usuario.", tipo: "derechos", disponible: "Lun a vie · 7:00–19:00" }
  ];

  /* ============================================================
     RUTAS DE ATENCIÓN (qué hacer ante…)
     ============================================================ */
  const rutas = [
    {
      id: "dolor-toracico",
      titulo: "Dolor en el pecho o sospecha de infarto",
      icono: "heart-pulse",
      gravedad: "Urgencia vital",
      acciones: [
        "Llame de inmediato al 123 y siga las indicaciones del regulador.",
        "Mantenga a la persona sentada, en reposo absoluto y con ropa holgada.",
        "No le dé alimentos, bebidas ni medicamentos no indicados por el personal de salud.",
        "Si pierde la consciencia y no respira, inicie RCP si sabe cómo y pida ayuda al 123 para recibir instrucciones."
      ],
      donde: "Urgencias del Hospital Distrital Luis Ablanque de la Plata (24 h) o la clínica con urgencias más cercana.",
      llamar: ["123", "125"]
    },
    {
      id: "accidente",
      titulo: "Accidente de tránsito o trauma",
      icono: "activity",
      gravedad: "Urgencia vital",
      acciones: [
        "Llame al 123; describa ubicación exacta, número de heridos y estado de consciencia.",
        "No mueva a la persona lesionada salvo riesgo inminente (incendio, derrumbe).",
        "Señalice la zona y controle el sangrado visible con presión directa y paños limpios.",
        "Acompañe a la persona hasta la llegada de los servicios de emergencia."
      ],
      donde: "El traslado lo define el CRUE (125) según gravedad y disponibilidad de camas.",
      llamar: ["123", "132"]
    },
    {
      id: "gestante",
      titulo: "Signos de alarma en el embarazo",
      icono: "baby",
      gravedad: "Urgencia materna",
      acciones: [
        "Ante sangrado, dolor intenso, salida de líquido, fiebre o disminución de movimientos del bebé, vaya de inmediato a urgencias.",
        "Lleve el carné de control prenatal y el documento de identidad.",
        "En zona rural, contacte la remisión por el puesto de salud o llame al 123/125 para coordinar el traslado."
      ],
      donde: "Urgencias con atención materno-perinatal (Hospital Distrital, 24 h).",
      llamar: ["123", "125"]
    },
    {
      id: "mordedura",
      titulo: "Mordedura de serpiente u ofidismo",
      icono: "droplet",
      gravedad: "Urgencia vital · alta incidencia en el Pacífico",
      acciones: [
        "Llame al 123 y traslade cuanto antes a un servicio de urgencias: el antídoto es tiempo-dependiente.",
        "Mantenga a la persona en reposo y la extremidad afectada inmóvil, por debajo del nivel del corazón.",
        "NO aplique torniquetes, cortes, succión, hielo ni remedios caseros.",
        "Si es posible y seguro, fotografíe la serpiente desde lejos para ayudar a identificarla. Nunca intente capturarla."
      ],
      donde: "Urgencias del Hospital Distrital (dispone de suero antiofídico y coordina remisión si se requiere UCI).",
      llamar: ["123", "125"]
    },
    {
      id: "fiebre-dengue",
      titulo: "Fiebre alta o sospecha de dengue",
      icono: "thermometer",
      gravedad: "Urgencia si hay signos de alarma",
      acciones: [
        "Con fiebre alta súbita, dolor de cabeza intenso, dolor detrás de los ojos o malestar general: consulte el mismo día.",
        "Signos de alarma (vaya urgente a urgencias): dolor abdominal intenso, vómito persistente, sangrado de encías o nariz, somnolencia o irritabilidad.",
        "Hidrate con agua o sales orales; use solo acetaminofén. Evite ibuprofeno, aspirina y automedicación.",
        "Elimine depósitos de agua destapados en casa y use toldillo o repelente."
      ],
      donde: "Consulta prioritaria en cualquier IPS de la red; urgencias ante signos de alarma.",
      llamar: ["123"]
    },
    {
      id: "salud-mental",
      titulo: "Crisis de salud mental o riesgo de suicidio",
      icono: "brain",
      gravedad: "Urgencia psicosocial",
      acciones: [
        "No deje sola a la persona; escuche sin juzgar y hable con calma.",
        "Llame al 123 para orientación y activación de la ruta de emergencia.",
        "Retire de su alcance objetos o sustancias de riesgo.",
        "Acompáñela a urgencias o al Centro Comunitario de Salud Mental para valoración y seguimiento."
      ],
      donde: "Urgencias (valoración inmediata) y Centro Comunitario de Salud Mental (seguimiento y escucha).",
      llamar: ["123"]
    }
  ];

  /* ============================================================
     AVISOS Y NOVEDADES
     ============================================================ */
  const avisos = [
    { fecha: "2026-09-22", titulo: "Actualización del directorio distrital", extracto: "Se verificaron fichas de 17 instituciones y se incorporaron los horarios de las brigadas fluviales de octubre.", categoria: "Plataforma", icono: "clipboard-list" },
    { fecha: "2026-09-15", titulo: "Dengue: reforzamiento de la prevención en zona urbana y ribereña", extracto: "Ante el aumento de casos en el Pacífico, la Secretaría de Salud intensifica las jornadas de control de criaderos. Conozca los signos de alarma.", categoria: "Salud pública", icono: "thermometer" },
    { fecha: "2026-09-08", titulo: "Jornada fluvial de vacunación con el Buque Hospital «Benkós Biohó»", extracto: "La brigada recorrerá los corregimientos del río Raposo y la costa entre el 6 y el 17 de octubre. Consulte las paradas programadas.", categoria: "Jornadas", icono: "anchor" },
    { fecha: "2026-08-30", titulo: "Convocatoria: pruebas de usabilidad del prototipo", extracto: "Buscamos ciudadanos de todas las comunas y corregimientos para validar la plataforma. Participar toma 30 minutos.", categoria: "Proyecto", icono: "users" }
  ];

  /* ============================================================
     PREGUNTAS FRECUENTES
     ============================================================ */
  const faqs = [
    { q: "¿Qué es Salud Buenaventura?", a: "Es un prototipo de plataforma pública de orientación ciudadana que centraliza, en un solo lugar, la información de los servicios de salud del Distrito: instituciones, horarios, requisitos, ubicaciones y canales oficiales de atención." },
    { q: "¿Tiene algún costo?", a: "No. La consulta de la plataforma es y será gratuita. Tampoco cobra por los trámites que orienta: la afiliación a una EPS, el Sisbén y la vacunación son trámites gratuitos por ley." },
    { q: "¿Puedo agendar citas aquí?", a: "No directamente. La plataforma no reemplaza los sistemas institucionales: lo orienta para que pida su cita por el canal oficial correcto (línea, WhatsApp, web o punto presencial) de su EPS o IPS, evitando desplazamientos en vano." },
    { q: "¿Cada cuánto se actualiza la información?", a: "El prototipo trabaja con ciclos de verificación y fecha de actualización visible en cada ficha. La versión productiva definirá responsables de actualización y acuerdos de reporte de cambios con las IPS." },
    { q: "¿Qué hago si un dato está desactualizado?", a: "Repórtelo por el canal de contacto de la plataforma. Los reportes ciudadanos alimentan el ciclo de verificación y permiten corregir fichas con la institución correspondiente." },
    { q: "¿La plataforma guarda mis datos personales?", a: "El prototipo no solicita ni almacena datos personales: la búsqueda es anónima. La versión productiva aplicará el principio de minimización de datos y la normativa colombiana de protección (Ley 1581 de 2012)." }
  ];

  /* ============================================================
     METADATOS GLOBALES
     ============================================================ */
  const meta = {
    nombre: "Salud Buenaventura",
    version: "1.0.0",
    actualizado: "2026-09-26",
    disclaimer: "Prototipo académico. Los datos de instituciones marcadas «Por verificar» son ilustrativos; confirme siempre en los canales oficiales antes de desplazarse."
  };

  global.SBData = { meta, servicios, servicioById, ips, tramites, lineas, rutas, avisos, faqs };
})(window);
