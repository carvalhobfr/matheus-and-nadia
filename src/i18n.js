import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  navbar: {
    home: 'Home',
    story: 'Our Story',
    details: 'Event Details',
    gallery: 'Gallery',
    gifts: 'Gifts',
    message: 'Messages'
  },
  hero: {
    title: 'Matheus & Nadia',
    subtitle: 'We are getting married!',
    date: 'December 15, 2024',
    location: 'Tailândia'
  },
  countdown: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    title: 'Countdown to Our Big Day',
    completed: 'The Big Day is Here!',
    celebration: 'Time to celebrate our love!',
    timeRemaining: 'Time Remaining',
    weddingDate: 'Wedding Date',
    thailandTime: 'Current Time in Thailand'
  },
  story: {
    title: 'Our Love Story',
    intro: 'How we met and fell in love',
    timeline: [
      {
        date: 'June 2020',
        title: 'First Meeting',
        description: 'We met through mutual friends at a beach party in Rio de Janeiro.'
      },
      {
        date: 'December 2020',
        title: 'First Date',
        description: 'Our first official date was at a cozy restaurant overlooking the ocean.'
      },
      {
        date: 'August 2021',
        title: 'Moving In Together',
        description: 'We decided to take the next step and move in together.'
      },
      {
        date: 'February 2023',
        title: 'The Proposal',
        description: 'Matheus proposed during a surprise trip to Barcelona.'
      }
    ]
  },
  details: {
    title: 'Wedding Details',
    ceremony: {
      title: 'Ceremony',
      date: 'December 15, 2024',
      time: '4:00 PM',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Tailândia'
    },
    reception: {
      title: 'Reception',
      date: 'December 15, 2024',
      time: '6:00 PM',
      location: 'Beachfront Resort - Garden Pavilion',
      address: '123 Beach Road, Tailândia'
    },
    accommodation: {
      title: 'Accommodation',
      description: 'We have arranged special rates at the Beachfront Resort for our guests. Please mention our wedding when booking.'
    },
    dress: {
      title: 'Dress Code',
      description: 'Beach Formal / Cocktail Attire'
    }
  },
  gifts: {
    title: 'Wedding Gifts',
    intro: 'As we celebrate our special day in an intimate elopement, your warm wishes mean the world to us. If you would like to send a gift, here are some options:',
    honeymoon: {
      title: 'Contribute to Our Honeymoon',
      description: 'Help us create unforgettable memories on our honeymoon trip to Tailândia.'
    },
    mbway: {
      title: 'MBWay',
      description: 'Send your gift via MBWay to:',
      number: '+351 912 345 678'
    },
    pix: {
      title: 'Pix',
      description: 'Send your gift via Pix to:',
      key: 'matheus@email.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Send your gift via Bizum to:',
      number: '+34 612 345 678'
    }
  },
  message: {
    title: 'Message to the Couple',
    intro: 'We would love to hear from you! Send us your wishes, thoughts, or just say hello.',
    form: {
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      submit: 'Send Message',
      sending: 'Sending...',
      error: {
        required: 'Please fill in all required fields',
        email: 'Please enter a valid email address'
      }
    },
    thanks: 'Thank you for your message!',
    confirmation: 'We have received your message and will cherish your kind words.'
  },
  footer: {
    credit: 'Made with love for our special day',
    copyright: '© 2024 Matheus & Nadia'
  }
};

// Portuguese translations
const ptTranslations = {
  navbar: {
    home: 'Início',
    story: 'Nossa História',
    details: 'Detalhes do Evento',
    gallery: 'Galeria',
    gifts: 'Presentes',
    message: 'Mensagens'
  },
  hero: {
    title: 'Matheus & Nadia',
    subtitle: 'Vamos nos casar!',
    date: '15 de Dezembro de 2024',
    location: 'Tailândia'
  },
  countdown: {
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    title: 'Contagem Regressiva para o Grande Dia',
    completed: 'O Grande Dia Chegou!',
    celebration: 'Hora de celebrar nosso amor!',
    timeRemaining: 'Tempo Restante',
    weddingDate: 'Data do Casamento',
    thailandTime: 'Horário Atual na Tailândia'
  },
  story: {
    title: 'Nossa História de Amor',
    intro: 'Como nos conhecemos e nos apaixonamos',
    timeline: [
      {
        date: 'Junho de 2020',
        title: 'Primeiro Encontro',
        description: 'Nos conhecemos através de amigos em comum em uma festa na praia no Rio de Janeiro.'
      },
      {
        date: 'Dezembro de 2020',
        title: 'Primeiro Encontro Oficial',
        description: 'Nosso primeiro encontro oficial foi em um restaurante aconchegante com vista para o oceano.'
      },
      {
        date: 'Agosto de 2021',
        title: 'Morando Juntos',
        description: 'Decidimos dar o próximo passo e morar juntos.'
      },
      {
        date: 'Fevereiro de 2023',
        title: 'O Pedido',
        description: 'Matheus fez o pedido durante uma viagem surpresa a Barcelona.'
      }
    ]
  },
  details: {
    title: 'Detalhes do Casamento',
    ceremony: {
      title: 'Cerimônia',
      date: '15 de Dezembro de 2024',
      time: '16:00',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Tailândia'
    },
    reception: {
      title: 'Recepção',
      date: '15 de Dezembro de 2024',
      time: '18:00',
      location: 'Beachfront Resort - Pavilhão do Jardim',
      address: '123 Beach Road, Tailândia'
    },
    accommodation: {
      title: 'Hospedagem',
      description: 'Organizamos tarifas especiais no Beachfront Resort para nossos convidados. Por favor, mencione nosso casamento ao fazer a reserva.'
    },
    dress: {
      title: 'Código de Vestimenta',
      description: 'Formal de Praia / Traje Cocktail'
    }
  },
  gifts: {
    title: 'Presentes de Casamento',
    intro: 'Enquanto celebramos nosso dia especial em um casamento íntimo, seus votos de felicidade significam muito para nós. Se você desejar enviar um presente, aqui estão algumas opções:',
    honeymoon: {
      title: 'Contribua para Nossa Lua de Mel',
      description: 'Ajude-nos a criar memórias inesquecíveis em nossa lua de mel na Tailândia.'
    },
    mbway: {
      title: 'MBWay',
      description: 'Envie seu presente via MBWay para:',
      number: '+351 912 345 678'
    },
    pix: {
      title: 'Pix',
      description: 'Envie seu presente via Pix para:',
      key: 'matheus@email.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Envie seu presente via Bizum para:',
      number: '+34 612 345 678'
    }
  },
  message: {
    title: 'Mensagem para os Noivos',
    intro: 'Adoraríamos receber sua mensagem! Envie seus votos, pensamentos ou apenas diga olá.',
    form: {
      name: 'Seu Nome',
      email: 'Seu Email',
      message: 'Sua Mensagem',
      submit: 'Enviar Mensagem',
      sending: 'Enviando...',
      error: {
        required: 'Por favor, preencha todos os campos obrigatórios',
        email: 'Por favor, insira um endereço de email válido'
      }
    },
    thanks: 'Obrigado pela sua mensagem!',
    confirmation: 'Recebemos sua mensagem e guardaremos suas palavras com carinho.'
  },
  footer: {
    credit: 'Feito com amor para o nosso dia especial',
    copyright: '© 2024 Matheus & Nadia'
  }
};

// Spanish translations
const esTranslations = {
  navbar: {
    home: 'Inicio',
    story: 'Nuestra Historia',
    details: 'Detalles del Evento',
    gallery: 'Galería',
    gifts: 'Regalos',
    message: 'Mensajes'
  },
  hero: {
    title: 'Matheus & Nadia',
    subtitle: '¡Nos vamos a casar!',
    date: '15 de Diciembre de 2024',
    location: 'Tailândia'
  },
  countdown: {
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    title: 'Cuenta Atrás para Nuestro Gran Día',
    completed: '¡El Gran Día ha Llegado!',
    celebration: '¡Es hora de celebrar nuestro amor!',
    timeRemaining: 'Tiempo Restante',
    weddingDate: 'Fecha de la Boda',
    thailandTime: 'Hora Actual en Tailandia'
  },
  story: {
    title: 'Nuestra Historia de Amor',
    intro: 'Cómo nos conocimos y nos enamoramos',
    timeline: [
      {
        date: 'Junio de 2020',
        title: 'Primer Encuentro',
        description: 'Nos conocimos a través de amigos en común en una fiesta en la playa en Río de Janeiro.'
      },
      {
        date: 'Diciembre de 2020',
        title: 'Primera Cita',
        description: 'Nuestra primera cita oficial fue en un acogedor restaurante con vistas al océano.'
      },
      {
        date: 'Agosto de 2021',
        title: 'Viviendo Juntos',
        description: 'Decidimos dar el siguiente paso y vivir juntos.'
      },
      {
        date: 'Febrero de 2023',
        title: 'La Propuesta',
        description: 'Matheus propuso matrimonio durante un viaje sorpresa a Barcelona.'
      }
    ]
  },
  details: {
    title: 'Detalles de la Boda',
    ceremony: {
      title: 'Ceremonia',
      date: '15 de Diciembre de 2024',
      time: '16:00',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Tailândia'
    },
    reception: {
      title: 'Recepción',
      date: '15 de Diciembre de 2024',
      time: '18:00',
      location: 'Beachfront Resort - Pabellón del Jardín',
      address: '123 Beach Road, Tailândia'
    },
    accommodation: {
      title: 'Alojamiento',
      description: 'Hemos organizado tarifas especiales en el Beachfront Resort para nuestros invitados. Por favor, mencione nuestra boda al hacer la reserva.'
    },
    dress: {
      title: 'Código de Vestimenta',
      description: 'Formal de Playa / Atuendo de Cóctel'
    }
  },
  gifts: {
    title: 'Regalos de Boda',
    intro: 'Mientras celebramos nuestro día especial en una boda íntima, tus buenos deseos significan mucho para nosotros. Si deseas enviar un regalo, aquí hay algunas opciones:',
    honeymoon: {
      title: 'Contribuir a Nuestra Luna de Miel',
      description: 'Ayúdanos a crear recuerdos inolvidables en nuestra luna de miel en Tailândia.'
    },
    mbway: {
      title: 'MBWay',
      description: 'Envía tu regalo a través de MBWay a:',
      number: '+351 912 345 678'
    },
    pix: {
      title: 'Pix',
      description: 'Envía tu regalo a través de Pix a:',
      key: 'matheus@email.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Envía tu regalo a través de Bizum a:',
      number: '+34 612 345 678'
    }
  },
  message: {
    title: 'Mensaje para los Novios',
    intro: '¡Nos encantaría saber de ti! Envíanos tus deseos, pensamientos o simplemente salúdanos.',
    form: {
      name: 'Tu Nombre',
      email: 'Tu Email',
      message: 'Tu Mensaje',
      submit: 'Enviar Mensaje',
      sending: 'Enviando...',
      error: {
        required: 'Por favor, completa todos los campos requeridos',
        email: 'Por favor, introduce una dirección de email válida'
      }
    },
    thanks: '¡Gracias por tu mensaje!',
    confirmation: 'Hemos recibido tu mensaje y atesoraremos tus amables palabras.'
  },
  footer: {
    credit: 'Hecho con amor para nuestro día especial',
    copyright: '© 2024 Matheus & Nadia'
  }
};

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations },
      es: { translation: esTranslations }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n; 