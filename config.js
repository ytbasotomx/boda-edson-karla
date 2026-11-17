/*
  CONFIGURACIÓN DEL EVENTO
  Edita este archivo para cambiar los datos sin modificar el diseño.
  Todo lo que dice "por confirmar" o "EJEMPLO" debe sustituirse antes de publicar.
*/
const WEDDING_CONFIG = {
  couple: {
    groom: "Edson Cota",
    bride: "Karla Cano",
    shortNames: "Edson & Karla"
  },

  // Se muestra en la portada, debajo de la fecha. Déjalo vacío para ocultarlo.
  city: "Playas de Tijuana, Baja California",

  date: {
    // Formato: AAAA-MM-DDTHH:mm:ss con la zona horaria de Tijuana en noviembre (-08:00).
    // El día, el calendario, la cuenta regresiva y el archivo .ics salen de estos valores.
    ceremonyISO: "2027-11-20T17:00:00-08:00",
    receptionISO: "2027-11-20T19:00:00-08:00",
    endISO: "2027-11-21T00:00:00-08:00",
    // Último día para confirmar, por ejemplo "2027-10-20". Vacío = sin fecha límite.
    rsvpDeadline: ""
  },

  locations: {
    ceremony: {
      name: "La ceremonia",
      address: "Del Ciclón 648, Playas de Tijuana, Costa Hermosa, 22506 Tijuana, Baja California, México",
      time: "5:00 p. m.",
      mapUrl: "",    // enlace de Google Maps; si queda vacío se genera a partir de la dirección
      mapEmbed: ""   // opcional: el "src" del iframe de Google Maps > Compartir > Insertar un mapa
    },
    reception: {
      name: "La recepción",
      address: "Del Ciclón 648, Playas de Tijuana, Costa Hermosa, 22506 Tijuana, Baja California, México",
      time: "7:00 p. m.",
      mapUrl: "",
      mapEmbed: ""
    }
  },

  // Cada valor puede ser un texto o una lista: ["Nombre del papá", "Nombre de la mamá"]
  family: {
    groomParents: ["Lluvia Gabriela Domínguez Alaníz", "Juan Daniel Cota Corrales"],
    brideParents: ["Enrique Cano López", "Blanca Patricia Ruvalcaba Ramírez"],
    godparents: ["Margarita Flores López", "Manuel Ramírez"]
  },

  itinerary: [
    { time: "5:00 p. m.", title: "Ceremonia", description: "Acompáñanos en este momento especial." },
    { time: "6:00 p. m.", title: "Fotografías y felicitaciones", description: "Un momento para compartir y celebrar." },
    { time: "7:00 p. m.", title: "Recepción", description: "Comienza la celebración." },
    { time: "8:00 p. m.", title: "Cena y festejo", description: "Horario provisional." }
  ],

  dressCode: {
    title: "Formal",
    description: "Queremos compartir una celebración especial contigo. Te invitamos a vestir de manera formal.",
    note: "Indicaciones específicas de color o estilo: por confirmar.",
    // Paleta de la boda. Vacía la lista ([]) si no quieres mostrarla.
    palette: [
      { name: "Olivo", color: "#797B55" },
      { name: "Salvia", color: "#C4C9B5" },
      { name: "Pistache", color: "#8E9472" },
      { name: "Champaña", color: "#E4D8C8" },
      { name: "Alabastro", color: "#FCF9F0" }
    ]
  },

  // Número internacional sin +, espacios ni guiones. Ejemplo de formato: 526641234567.
  // Mientras esté vacío, el formulario prepara el mensaje para copiarlo.
  whatsappNumber: "",

  // Enlace de la carpeta compartida para las fotos de los invitados (Google Drive, Google Fotos...).
  // Al llenarlo se genera el código QR automáticamente.
  liveGalleryUrl: "",

  // Ruta de la canción, por ejemplo "assets/music.mp3". Vacío = sin música.
  music: "",

  // INVITADOS
  // Usa claves aleatorias (no números consecutivos) para que nadie adivine el pase de otra familia.
  // Enlace de cada invitado:  .../index.html?id=CLAVE
  // Las dos entradas siguientes son de EJEMPLO: bórralas y agrega tu lista.
  guestList: {
    "k7m2xq": {
      titular: "Familia Ortega Salas",
      pases: 4,
      nombres: ["Raúl Ortega", "Carmen Salas", "Diego Ortega", "Valeria Ortega"]
    },
    "p4t9wd": {
      titular: "Luis Herrera",
      pases: 2,
      nombres: ["Luis Herrera", "Acompañante"]
    }
  },

  // Fotos de "Nuestra historia", guardadas en assets/fotos/. Se acomodan en bloques de cinco:
  // la 1.ª, 6.ª, 11.ª... y la 10.ª, 20.ª... se ven en formato alto, así que conviene que sean verticales.
  // La cuadrícula queda completa con 5, 10 o 15 fotos. La ruta distingue mayúsculas: 1.jpeg no es 1.JPEG.
  gallery: [
    { src: "assets/fotos/1.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/2.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/3.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/4.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/5.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/6.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/7.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/8.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/9.jpeg", alt: "Edson y Karla" },
    { src: "assets/fotos/10.jpeg", alt: "Edson y Karla" }
  ],

  // Ejemplo: { name: "Liverpool", detail: "Evento 12345678", url: "https://..." }
  giftLinks: [],

  // Ejemplo: { name: "Hotel ejemplo", detail: "A 10 minutos del evento", url: "https://..." }
  hotels: []
};
