/*
  LÓGICA DE LA INVITACIÓN
  1. Utilidades             6. Listas: hoteles, regalos, galería
  2. Fecha y calendario     7. Vestimenta y galería en vivo
  3. Cuenta regresiva       8. Pase personal y confirmación
  4. Familia y ubicaciones  9. Sobre, menú, música y animaciones
  5. Itinerario
  Los datos viven en config.js. Aquí no hay que editar nada para personalizar.
*/
(() => {
  "use strict";

  // Un "const" de otro archivo no se guarda en window: se lee por su nombre.
  if (typeof WEDDING_CONFIG === "undefined") {
    console.error("No se encontró WEDDING_CONFIG. Revisa que config.js cargue antes que script.js.");
    return;
  }
  const config = WEDDING_CONFIG;

  /* ---------- 1. UTILIDADES ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const pad = (number) => String(number).padStart(2, "0");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coupleNames = `${config.couple.groom} y ${config.couple.bride}`;

  // Dentro de un visor incrustado no se permiten descargas ni mapas de otros sitios.
  let embedded = false;
  try { embedded = window.self !== window.top; } catch (error) { embedded = true; }

  // Crea elementos usando textContent: ningún dato se inserta como HTML.
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === "text") node.textContent = value;
      else if (key === "class") node.className = value;
      else node.setAttribute(key, value);
    }
    children.flat().forEach((child) => { if (child) node.append(child); });
    return node;
  }
  function icon(name) {
    const svg = document.createElementNS(SVG_NS, "svg");
    const use = document.createElementNS(SVG_NS, "use");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  }
  const externalLink = (className, url, ...children) => el("a", { class: className, href: url, target: "_blank", rel: "noopener" }, ...children);
  const asList = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean);
  function setStatus(node, text, isError = false) {
    node.textContent = text;
    node.classList.toggle("is-error", isError);
  }

  /* ---------- 2. FECHA Y CALENDARIO ----------
     El día se lee del texto de ceremonyISO, así no cambia según la zona
     horaria de quien abre la invitación. */
  const [year, month, day] = config.date.ceremonyISO.slice(0, 10).split("-").map(Number);
  const timeZoneOffset = config.date.ceremonyISO.slice(19) || "Z";
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const startTime = new Date(config.date.ceremonyISO).getTime();
  const endTime = config.date.endISO ? new Date(config.date.endISO).getTime() : startTime + 8 * 36e5;
  const dayAndMonth = (iso) => { const [, m, d] = iso.slice(0, 10).split("-").map(Number); return `${d} de ${MONTHS[m - 1]}`; };

  function renderDate() {
    const texts = {
      long: `${weekday} · ${day} de ${MONTHS[month - 1]} · ${year}`,
      short: `${pad(day)} · ${pad(month)} · ${year}`,
      weekday
    };
    $$("[data-date]").forEach((node) => {
      if (node.dataset.date === "split") {
        node.replaceChildren(pad(day), el("span", { text: "·" }), pad(month), el("span", { text: "·" }), String(year));
        node.setAttribute("aria-label", `${day} de ${MONTHS[month - 1]} de ${year}`);
      } else {
        node.textContent = texts[node.dataset.date];
      }
    });
    if (config.city) $("#heroPlace").textContent = config.city; else $("#heroPlace").hidden = true;
  }

  function renderCalendar() {
    const leadingBlanks = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;   // semana de lunes a domingo
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const grid = el("div", { class: "calendar-grid", role: "img", "aria-label": `Calendario de ${MONTHS[month - 1]} de ${year} con el día ${day} marcado` });
    ["L", "M", "M", "J", "V", "S", "D"].forEach((label) => grid.append(el("span", { class: "is-label", text: label })));
    for (let i = 0; i < leadingBlanks; i++) grid.append(el("span"));
    for (let n = 1; n <= daysInMonth; n++) grid.append(el("span", { class: n === day ? "is-day" : "", text: String(n) }));
    $("#calendar").append(el("p", { class: "calendar-month", text: `${MONTHS[month - 1]} ${year}` }), grid);
  }

  function setupCalendarLinks() {
    const utc = (time) => new Date(time).toISOString().replace(/[-:]|\.\d{3}/g, "");
    const escapeICS = (text) => text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
    const { ceremony, reception } = config.locations;
    const title = `Boda de ${coupleNames}`;
    const details = `Ceremonia a las ${ceremony.time}. Recepción a las ${reception.time}.`;

    const google = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${utc(startTime)}/${utc(endTime)}`, details, location: ceremony.address });
    $("#googleCalendar").href = `https://calendar.google.com/calendar/render?${google}`;

    if (embedded) return;   // la descarga del .ics funciona con el sitio publicado
    // Las horas van en UTC: así el archivo es válido sin declarar zonas horarias.
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Edson Cota y Karla Cano//Invitacion de boda//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:boda-${utc(startTime)}@edson-y-karla`,
      `DTSTAMP:${utc(Date.now())}`,
      `DTSTART:${utc(startTime)}`,
      `DTEND:${utc(endTime)}`,
      `SUMMARY:${escapeICS(title)}`,
      `LOCATION:${escapeICS(ceremony.address)}`,
      `DESCRIPTION:${escapeICS(details)}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const download = $("#downloadCalendar");
    download.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    download.hidden = false;
  }

  /* ---------- 3. CUENTA REGRESIVA ---------- */
  function startCountdown() {
    const box = $("#countdown");
    const timer = setInterval(tick, 1000);
    function tick() {
      const now = Date.now();
      const distance = startTime - now;
      if (distance <= 0) {
        clearInterval(timer);
        const text = now < endTime ? "¡Hoy celebramos el amor!" : "Gracias por celebrar con nosotros.";
        box.replaceChildren(el("p", { class: "countdown-finished", text }));
        return;
      }
      $("#days").textContent = Math.floor(distance / 864e5);
      $("#hours").textContent = pad(Math.floor(distance / 36e5) % 24);
      $("#minutes").textContent = pad(Math.floor(distance / 6e4) % 60);
      $("#seconds").textContent = pad(Math.floor(distance / 1e3) % 60);
    }
    tick();
  }

  /* ---------- 4. FAMILIA Y UBICACIONES ---------- */
  function renderFamily() {
    const groups = { groomParents: config.family.groomParents, brideParents: config.family.brideParents, godparents: config.family.godparents };
    for (const [id, value] of Object.entries(groups)) {
      $(`#${id}`).replaceChildren(...asList(value).map((name) => el("span", { text: name })));
    }
  }

  function renderLocations() {
    for (const key of ["ceremony", "reception"]) {
      const place = config.locations[key];
      const mapUrl = place.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
      if (place.name) $(`#${key}Name`).textContent = place.name;
      $(`#${key}Time`).textContent = place.time;
      $(`#${key}Address`).textContent = place.address;
      $(`#${key}Map`).href = mapUrl;
      if (place.mapEmbed && !embedded) {
        const slot = $(`#${key}MapEmbed`);
        slot.append(el("iframe", { src: place.mapEmbed, loading: "lazy", title: `Mapa de ${place.name || key}`, referrerpolicy: "no-referrer-when-downgrade" }));
        slot.hidden = false;
      }
    }
  }

  /* ---------- 5. ITINERARIO ---------- */
  function renderItinerary() {
    $("#itineraryList").replaceChildren(...config.itinerary.map((item) => el("li", { class: "timeline-item" },
      el("p", { class: "timeline-time", text: item.time }),
      el("span", { class: "timeline-dot", "aria-hidden": "true" }),
      el("div", {}, el("h3", { class: "timeline-title", text: item.title }), el("p", { class: "timeline-description", text: item.description || "" }))
    )));
  }

  /* ---------- 6. LISTAS: HOTELES, REGALOS, GALERÍA ---------- */
  function infoCard(item) {
    const body = el("span", {}, el("b", { text: item.name }), item.detail ? el("small", { text: item.detail }) : null);
    return item.url ? externalLink("info-card", item.url, body, icon("arrow")) : el("div", { class: "info-card" }, body);
  }

  function renderLists() {
    if (config.hotels.length) {
      $("#lodgingIntro").textContent = "Si vienes de fuera, estas opciones quedan cerca del evento.";
      $("#hotelList").replaceChildren(el("div", { class: "card-list" }, config.hotels.map(infoCard)));
    }
    if (config.giftLinks.length) {
      $("#giftIntro").textContent = "Si deseas tener un detalle con nosotros, estas son las opciones de nuestra mesa de regalos.";
      $("#giftLinks").replaceChildren(el("div", { class: "card-list" }, config.giftLinks.map(infoCard)));
    }
  }

  function renderGallery() {
    if (!config.gallery.length) return;
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightboxImage");
    const photos = config.gallery.map((photo, index) => {
      const alt = photo.alt || `Fotografía de ${config.couple.shortNames}`;
      const button = el("button", { class: index === 0 ? "photo photo-tall" : "photo", type: "button", "aria-label": `Ampliar: ${alt}` },
        el("img", { src: photo.src, alt, loading: "lazy", decoding: "async" }));
      button.addEventListener("click", () => {
        lightboxImage.src = photo.src;
        lightboxImage.alt = alt;
        lightbox.showModal();
      });
      return button;
    });
    $("#galleryGrid").replaceChildren(...photos);
    $("#storyIntro").textContent = "Cada fotografía guarda un recuerdo. Estos son algunos de nuestros favoritos.";
    $("#storyNote").hidden = true;
    // Se cierra con Esc (nativo de <dialog>), con el botón o tocando fuera de la foto.
    lightbox.addEventListener("click", (event) => { if (event.target !== lightboxImage) lightbox.close(); });
  }

  /* ---------- 7. VESTIMENTA Y GALERÍA EN VIVO ---------- */
  function renderDressCode() {
    const dress = config.dressCode;
    $("#dressTitle").textContent = dress.title;
    $("#dressDescription").textContent = dress.description;
    $("#dressNote").textContent = dress.note || "";
    $("#dressNote").hidden = !dress.note;
    const palette = dress.palette || [];
    if (!palette.length) return;
    $("#palette").replaceChildren(...palette.map((tone) => {
      const swatch = el("span");
      swatch.style.setProperty("--swatch", tone.color);
      return el("li", {}, swatch, tone.name);
    }));
    $("#paletteBlock").hidden = false;
  }

  function renderLiveGallery() {
    const url = config.liveGalleryUrl;
    if (!url) return;
    $("#liveGalleryText").textContent = "Queremos ver la celebración desde tus ojos. Escanea el código o toca el botón para compartir tus fotografías y videos.";
    $("#qrCaption").textContent = "Escanea para subir tus fotos";
    const link = $("#liveGalleryLink");
    link.href = url;
    link.hidden = false;
    // El QR se dibuja en el navegador; la librería solo se carga cuando hay enlace.
    const library = el("script", { src: "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js" });
    library.addEventListener("load", () => {
      const qr = qrcode(0, "M");
      qr.addData(url);
      qr.make();
      const box = $("#qrBox");
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });   // SVG generado por la librería
      box.classList.add("has-code");
      $("svg", box).setAttribute("role", "img");
      $("svg", box).setAttribute("aria-label", "Código QR de la galería de fotos");
    });
    library.addEventListener("error", () => { $("#qrBox").hidden = true; $("#qrCaption").hidden = true; });
    document.head.append(library);
  }

  /* ---------- 8. PASE PERSONAL Y CONFIRMACIÓN ----------
     El pase llega en el enlace como ?id=CLAVE (o #CLAVE). */
  const guestKeys = Object.fromEntries(Object.keys(config.guestList).map((key) => [key.toLowerCase(), key]));
  let guestId = "";
  let guest = null;

  function findGuest(rawKey) {
    const key = String(rawKey || "").trim().toLowerCase();
    if (!key || !Object.prototype.hasOwnProperty.call(guestKeys, key)) return false;
    guestId = guestKeys[key];
    guest = config.guestList[guestId];
    return true;
  }

  function renderGuest() {
    if (!guest) return;
    const names = asList(guest.nombres);
    const seats = guest.pases || names.length;
    $("#guestGreeting").textContent = `Hola, ${guest.titular}. Nos encantará compartir este día contigo.`;
    $("#guestSummary").replaceChildren(
      el("p", { class: "eyebrow", text: "Pase personal" }),
      el("b", { text: guest.titular }),
      el("span", { text: seats === 1 ? "1 lugar reservado a tu nombre." : `${seats} lugares reservados. Marca quiénes podrán acompañarnos.` })
    );
    $("#guestSummary").hidden = false;
    $("#generalFields").hidden = true;
    const choices = $("#guestChoices");
    choices.replaceChildren(...names.map((name, index) => {
      const option = (value, text) => el("label", {}, el("input", { type: "radio", name: `guest-${index}`, id: `guest-${index}-${value}`, value }), text);
      return el("div", { class: "guest-row", role: "radiogroup", "aria-labelledby": `guest-name-${index}` },
        el("span", { id: `guest-name-${index}`, text: name }),
        el("span", { class: "choice" }, option("si", "Sí"), option("no", "No")));
    }));
    choices.hidden = false;
  }

  function buildConfirmation() {
    const note = $("#rsvpMessage").value.trim();
    const lines = [`Confirmación de boda · ${coupleNames}`];
    if (guest) {
      const attending = [], absent = [];
      for (const [index, name] of asList(guest.nombres).entries()) {
        const checked = $(`input[name="guest-${index}"]:checked`);
        if (!checked) return { error: "Marca Sí o No para cada persona del pase." };
        (checked.value === "si" ? attending : absent).push(name);
      }
      lines.push(`Pase: ${guest.titular}`);
      if (attending.length) lines.push(`Asisten (${attending.length}): ${attending.join(", ")}`);
      if (absent.length) lines.push(`No podrán asistir: ${absent.join(", ")}`);
    } else {
      const name = $("#guestName").value.trim();
      const attendance = $("#attendance").value;
      if (!name || !attendance) return { error: "Escribe tu nombre y elige tu respuesta." };
      lines.push(`Nombre: ${name}`, `Respuesta: ${attendance}`);
    }
    if (note) lines.push(`Mensaje: ${note}`);
    return { message: lines.join("\n") };
  }

  // WhatsApp se abre con un enlace normal, que funciona aunque el navegador bloquee ventanas emergentes.
  // Si falta el número en config.js, el mensaje queda listo para copiarse.
  function showMessagePanel(panel, message) {
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    const feedback = el("p", { class: "form-status", role: "status" });
    const copy = el("button", { class: number ? "button button--outline" : "button", type: "button" }, icon("copy"), "Copiar mensaje");
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(message);
        setStatus(feedback, "Mensaje copiado.");
      } catch (error) {
        setStatus(feedback, "No se pudo copiar. Selecciona el texto y cópialo a mano.", true);
      }
    });
    const intro = number
      ? "Tu mensaje está listo. Ábrelo en WhatsApp y presiona enviar para que cuente."
      : "Tu mensaje está listo. Cópialo y envíalo a los novios.";
    if (!number) console.warn("Falta whatsappNumber en config.js: el mensaje solo se puede copiar.");
    const whatsapp = number ? externalLink("button", `https://wa.me/${number}?text=${encodeURIComponent(message)}`, icon("chat"), "Abrir WhatsApp") : null;
    panel.replaceChildren(
      el("p", { text: intro }),
      el("pre", { class: "message-preview", text: message }),
      el("div", { class: "message-actions" }, whatsapp, copy),
      feedback
    );
    panel.hidden = false;
    (whatsapp || copy).focus({ preventScroll: true });
    panel.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }

  function setupForms() {
    const rsvpForm = $("#rsvpForm");
    const rsvpStatus = $("#rsvpStatus");
    const rsvpPanel = $("#rsvpPanel");
    const deadline = config.date.rsvpDeadline;

    if (deadline) {
      const closed = Date.now() > new Date(`${deadline}T23:59:59${timeZoneOffset}`).getTime();
      $("#rsvpHelp").textContent = closed
        ? `La confirmación cerró el ${dayAndMonth(deadline)}. Si necesitas un cambio, escribe a los novios.`
        : `Confirma antes del ${dayAndMonth(deadline)}. Tu respuesta se envía por WhatsApp.`;
      if (closed) $$("#rsvpForm > :not(#rsvpHelp)").forEach((node) => { node.hidden = true; });
    }

    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = buildConfirmation();
      if (result.error) { setStatus(rsvpStatus, result.error, true); rsvpPanel.hidden = true; return; }
      setStatus(rsvpStatus, "");
      showMessagePanel(rsvpPanel, result.message);
    });
    rsvpForm.addEventListener("input", () => { setStatus(rsvpStatus, ""); rsvpPanel.hidden = true; });

    const wishesForm = $("#wishesForm");
    const wishStatus = $("#wishStatus");
    const wishPanel = $("#wishPanel");
    wishesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#wishName").value.trim();
      const wish = $("#wishText").value.trim();
      if (!name || !wish) { setStatus(wishStatus, "Escribe tu nombre y tu mensaje.", true); wishPanel.hidden = true; return; }
      setStatus(wishStatus, "");
      showMessagePanel(wishPanel, `Buenos deseos para ${config.couple.shortNames}\nDe: ${name}\n\n"${wish}"`);
    });
    wishesForm.addEventListener("input", () => { setStatus(wishStatus, ""); wishPanel.hidden = true; });
  }

  /* ---------- 9. SOBRE, MENÚ, MÚSICA Y ANIMACIONES ---------- */
  function setupMusic() {
    const audio = $("#backgroundMusic");
    const button = $("#musicButton");
    const setState = (playing) => {
      $("#musicIcon").setAttribute("href", playing ? "#i-pause" : "#i-music");
      button.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
    };
    const play = () => audio.play().then(() => setState(true)).catch(() => setState(false));
    if (config.music) {
      audio.src = config.music;
      audio.addEventListener("error", () => { button.hidden = true; });
    }
    button.addEventListener("click", () => { if (audio.paused) play(); else { audio.pause(); setState(false); } });
    document.addEventListener("visibilitychange", () => { if (document.hidden && !audio.paused) { audio.pause(); setState(false); } });
    return { start() { if (!config.music) return; button.hidden = false; play(); } };
  }

  function setupHeader() {
    const header = $("#siteHeader");
    const toggle = $("#menuToggle");
    const nav = $("#mainNav");
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      $("#menuIcon").setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    $$("a", nav).forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Solo se ocultan los bloques que quedan fuera de la pantalla; aparecen al llegar a ellos.
  function revealOnScroll() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("pending");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    $$(".section > *, .date-layout > *").forEach((block) => {
      if (block.classList.contains("date-layout")) return;
      block.classList.add("reveal");
      if (block.getBoundingClientRect().top > innerHeight * 0.92) {
        block.classList.add("pending");
        observer.observe(block);
      }
    });
  }

  function setupOpening(music) {
    const screen = $("#openingScreen");
    const envelope = $("#envelope");
    const page = [$("#siteHeader"), $("#contenido"), $(".site-footer")];
    const lock = (locked) => {
      document.body.classList.toggle("locked", locked);
      page.forEach((node) => { node.inert = locked; });
    };
    function open() {
      if (envelope.classList.contains("opened")) return;
      envelope.classList.add("opened");
      music.start();
      setTimeout(() => {
        screen.classList.add("closed");
        lock(false);
        revealOnScroll();
        $(".hero-names").focus({ preventScroll: true });
      }, reduceMotion ? 0 : 1500);
    }
    lock(true);
    envelope.addEventListener("click", open);
    $("#openInvitation").addEventListener("click", open);
  }

  /* ---------- ARRANQUE ---------- */
  renderDate();
  renderCalendar();
  setupCalendarLinks();
  startCountdown();
  renderFamily();
  renderLocations();
  renderItinerary();
  renderLists();
  renderGallery();
  renderDressCode();
  renderLiveGallery();
  findGuest(new URLSearchParams(location.search).get("id")) || findGuest(location.hash.slice(1));
  renderGuest();
  setupForms();
  setupHeader();
  setupOpening(setupMusic());
  // Permite cambiar de pase desde el enlace sin recargar; los enlaces del menú no lo borran.
  addEventListener("hashchange", () => { if (findGuest(location.hash.slice(1))) renderGuest(); });
})();
