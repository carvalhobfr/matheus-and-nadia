import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
export const enTranslations = {
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
    date: 'March 6, 2025',
    location: 'Thailand'
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
    intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    timeline: [
      {
        date: 'June 2020',
        title: 'First Meeting',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.'
      },
      {
        date: 'December 2020',
        title: 'First Date',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo efficitur neque a placerat. Integer vitae justo eget magna fermentum iaculis.'
      },
      {
        date: 'August 2021',
        title: 'Moving In Together',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor.'
      },
      {
        date: 'February 2023',
        title: 'The Proposal',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.'
      }
    ]
  },
  details: {
    title: 'Wedding Details',
    ceremony: {
      title: 'Ceremony',
      date: 'March 6, 2025',
      time: '5:00 PM',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Thailand'
    },
    reception: {
      title: 'Reception',
      date: 'March 6, 2025',
      time: '7:00 PM',
      location: 'Beachfront Resort - Garden Pavilion',
      address: '123 Beach Road, Thailand'
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
      description: 'Help us create unforgettable memories on our honeymoon trip to Thailand.'
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
    copyright: '© 2025 Matheus & Nadia'
  }
};

// Portuguese translations
export const ptTranslations = {
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
    date: '06.03.2025',
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
    intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    timeline: [
      {
        date: 'Junho de 2020',
        title: 'Primeiro Encontro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.'
      },
      {
        date: 'Dezembro de 2020',
        title: 'Primeiro Encontro Oficial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo efficitur neque a placerat. Integer vitae justo eget magna fermentum iaculis.'
      },
      {
        date: 'Agosto de 2021',
        title: 'Morando Juntos',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor.'
      },
      {
        date: 'Fevereiro de 2023',
        title: 'O Pedido',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.'
      }
    ]
  },
  details: {
    title: 'Detalhes do Casamento',
    ceremony: {
      title: 'Cerimônia',
      date: '06.03.2025',
      time: '17:00',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Tailândia'
    },
    reception: {
      title: 'Recepção',
      date: '06.03.2025',
      time: '19:00',
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
    copyright: '© 2025 Matheus & Nadia'
  }
};

// Spanish translations
export const esTranslations = {
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
    date: '06 de Marzo de 2025',
    location: 'Tailandia'
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
    intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    timeline: [
      {
        date: 'Junio de 2020',
        title: 'Primer Encuentro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.'
      },
      {
        date: 'Diciembre de 2020',
        title: 'Primera Cita',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo efficitur neque a placerat. Integer vitae justo eget magna fermentum iaculis.'
      },
      {
        date: 'Agosto de 2021',
        title: 'Viviendo Juntos',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor.'
      },
      {
        date: 'Febrero de 2023',
        title: 'La Propuesta',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.'
      }
    ]
  },
  details: {
    title: 'Detalles de la Boda',
    ceremony: {
      title: 'Ceremonia',
      date: '06 de Marzo de 2025',
      time: '17:00',
      location: 'Beachfront Resort',
      address: '123 Beach Road, Tailandia'
    },
    reception: {
      title: 'Recepción',
      date: '06 de Marzo de 2025',
      time: '19:00',
      location: 'Beachfront Resort - Pabellón del Jardín',
      address: '123 Beach Road, Tailandia'
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
      description: 'Ayúdanos a crear recuerdos inolvidables en nuestra luna de miel en Tailandia.'
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
    copyright: '© 2025 Matheus & Nadia'
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations
    },
    pt: {
      translation: ptTranslations
    },
    es: {
      translation: esTranslations
    }
  },
  lng: 'pt', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n; 