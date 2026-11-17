# Boda Edson Cota & Karla Cano

Invitación web estática hecha con HTML, CSS y JavaScript, sin frameworks ni backend. Conserva la estructura funcional de la referencia académica (sobre de apertura, pase por invitado, cuenta regresiva, confirmación por WhatsApp) con diseño y código propios.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura de las 13 secciones e íconos en SVG. |
| `styles.css` | Diseño adaptable. Los colores y tipografías están en el bloque `:root`. |
| `config.js` | **Todos los datos editables** de la boda. |
| `script.js` | Interacciones. No hace falta editarlo para personalizar. |
| `assets/` | Carpeta para fotografías y música. |

## Identidad visual

Paleta tomada del tablero "Olive Tulle":

| Color | Hex | Uso |
| --- | --- | --- |
| Olivo | `#797B55` | Acentos, listón, detalles |
| Salvia | `#C4C9B5` | Filetes y fondos suaves |
| Pistache | `#8E9472` | Bordes y líneas |
| Champaña | `#E4D8C8` | Fondos cálidos |
| Alabastro | `#FCF9F0` | Fondo principal |

El olivo original no alcanza el contraste mínimo para texto pequeño, así que el texto y los botones usan una versión más profunda (`#4E5236`). Tipografías de Google Fonts: WindSong (caligrafía de los nombres), Cormorant Garamond (títulos) y Jost (texto).

## Datos configurados actualmente

- Pareja: Edson Cota y Karla Cano.
- Fecha: sábado 20 de noviembre de 2027.
- Ceremonia 5:00 p. m. y recepción 7:00 p. m. (provisionales).
- Dirección provisional para ambos eventos: Del Ciclón 648, Playas de Tijuana, Costa Hermosa, 22506 Tijuana, Baja California.

## Cómo abrir y publicar

1. Descomprime la carpeta y abre `index.html` en un navegador.
2. Para publicar, sube el contenido de la carpeta a un repositorio de GitHub.
3. En GitHub entra a **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/root`, y guarda.

## Personalización (`config.js`)

| Campo | Para qué sirve |
| --- | --- |
| `date.ceremonyISO` | Fecha y hora de la ceremonia. De aquí salen el día, el calendario, la cuenta regresiva y el archivo `.ics`. |
| `date.endISO` | Fin de la fiesta (duración del evento en el calendario). |
| `date.rsvpDeadline` | Último día para confirmar. Al pasar, el formulario se cierra solo. Vacío = sin límite. |
| `city` | Línea de lugar en la portada. |
| `locations` | Nombre, dirección y hora de cada sede. `mapUrl` y `mapEmbed` son opcionales. |
| `family` | Padres y padrinos (texto o lista de nombres). |
| `itinerary` | Programa del día. |
| `dressCode` | Título, descripción, nota y paleta de colores. |
| `whatsappNumber` | Número de los novios en formato internacional, sin `+` ni espacios. |
| `liveGalleryUrl` | Carpeta compartida de fotos; al llenarlo se genera el código QR. |
| `music` | Ruta de la canción. Vacío = sin música. |
| `guestList` | Pases por invitado. |
| `gallery`, `giftLinks`, `hotels` | Fotos, mesa de regalos y hospedaje. Mientras estén vacíos se muestra "pendiente de confirmar". |

### Invitaciones individuales

Cada pase tiene una clave y se abre con `?id=CLAVE` (también funciona `#CLAVE`):

```js
guestList: {
  "k7m2xq": {
    titular: "Familia Ortega Salas",
    pases: 4,
    nombres: ["Raúl Ortega", "Carmen Salas", "Diego Ortega", "Valeria Ortega"]
  }
}
```

Usa claves aleatorias, no números consecutivos (`1`, `2`, `3`...): con números cualquiera puede cambiar el enlace y ver o confirmar el pase de otra familia. Aun así, la lista de un sitio estático es visible para quien inspeccione los archivos publicados; no incluyas información sensible. Las dos entradas incluidas son de ejemplo.

### WhatsApp

El formulario arma el mensaje y muestra un botón para abrirlo en WhatsApp. Mientras `whatsappNumber` esté vacío, el mensaje solo se puede copiar. Las respuestas **no** se guardan en ninguna base de datos; para registrarlas automáticamente hace falta un backend o un servicio de formularios.

## Qué cambió respecto a la primera versión

- **Corrección principal:** `script.js` leía `window.WEDDING_CONFIG`, pero una constante declarada con `const` en otro archivo no se guarda en `window`. El script se detenía con un error y no aparecían la cuenta regresiva, las direcciones, el itinerario ni la confirmación.
- La música usaba `preload="none"` y esperaba el evento `canplay`, que así nunca llega: el botón no aparecía. Ahora se activa con `music` en `config.js`.
- La cuenta regresiva distingue antes, durante y después de la boda.
- El archivo `.ics` usa horas en UTC (antes declaraba una zona horaria sin definirla) y se agregó el enlace a Google Calendar.
- WhatsApp se abre con un enlace normal en lugar de `window.open`, que algunos navegadores bloquean.
- El pase personal pide Sí o No por persona, en lugar de casillas más un selector que podían contradecirse.
- Nuevos: calendario del mes, visor de fotos, código QR automático, menú fijo, etiquetas Open Graph, navegación con teclado y respeto a "reducir movimiento".
- Los símbolos de texto (☰ ✦ ⌂ ♫) se reemplazaron por íconos SVG propios.

## Pendientes antes de publicar como invitación real

- Confirmar horarios y dirección exacta de cada evento.
- Incorporar nombres de padres y padrinos.
- Añadir fotografías autorizadas y, si se desea, la canción.
- Configurar WhatsApp, hospedajes, mesa de regalos y galería compartida.
- Sustituir los invitados de ejemplo por la lista real.
- Revisar la página en distintos celulares y navegadores.
