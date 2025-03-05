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
    title: "Our Story",
    subtitle: "A journey of love and adventures",
    firstMeet: {
      title: "We met",
      description: "In school in February 2010, studying at IFRJ to become an environmental technician. We didn't follow that career, but at least it served for us to meet."
    },
    firstDate: {
      title: "First Official Date",
      description: "Our first official date, not just as friends, was in March 2015 in one of the places we love to go, the cinema."
    },
    livingTogether: {
      title: "Living Together",
      description: "We started living together in 2017 when Nadia moved to Portugal to follow the love of her life, Matheus. (You can't even tell who's writing this, right?)"
    },
    proposal: {
      title: "The Proposal",
      description: "Well, life is complicated. The first proposal was in 2018 in the Algarve at a waterfall, but we were young and without much money. The second was the lucky one in 2021, for the wedding in 2025."
    },
    civilWedding: {
      title: "Civil Wedding",
      description: "In 2024, an intimate ceremony with a few friends took place in Aveiro. It was simple, but very beautiful!"
    }
  },
  details: {
    title: 'Wedding Details',
    ceremony: {
      title: 'Ceremony',
      date: 'March 6, 2025',
      time: '4:00 PM',
      location: 'Thailand',
      timezone: {
        title: 'Ceremony Times by Location',
        brazil: '6:00 AM (Brazil)',
        portugal: '10:00 AM (Portugal)',
        spain: '11:00 AM (Spain)'
      }
    },
    reception: {
      title: 'Reception',
      date: 'March 6, 2025',
      time: '7:00 PM',
      location: 'Thailand',
    },
    accommodation: {
      title: 'Accommodation',
      description: 'We will provide accommodation details closer to the wedding date.'
    },
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
      number: '+351934646436'
    },
    pix: {
      title: 'Pix',
      description: 'Send your gift via Pix to:',
      key: 'carvalho.bfr@gmail.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Send your gift via Bizum to:',
      number: '+34617384134'
    },
    confirmation: {
      title: 'Gift Sent!',
      message: 'Thank you for your generosity!',
      question: 'Would you like to send a message to the couple?',
      yes: 'Yes, send message',
      no: 'No, thank you'
    }
  },
  message: {
    title: 'Message to the Couple',
    intro: 'We would love to hear from you! Send us your wishes, thoughts, or just say hello.',
    donation_note: 'Message sent after donation via {{paymentMethod}}',
    form: {
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      name_placeholder: 'Your name',
      email_placeholder: 'your.email@example.com',
      message_placeholder: 'Write your message here...',
      submit: 'Send Message',
      sending: 'Sending...',
      error: {
        required: 'Please fill in all required fields',
        email: 'Please enter a valid email address',
        generic: 'An error occurred while sending the message. Please try again.'
      }
    },
    thanks: 'Thank you for your message!',
    confirmation: 'We have received your message and will cherish your kind words.'
  },
  footer: {
    credit: 'Feito com amor, pelos noivos, para o nosso dia especial',
    copyright: '© 2025 Matheus & Nadia'
  },
  gallery: {
    title: 'Gallery',
    imageViewer: 'Image Viewer',
    empty: {
      title: 'Capturing Special Moments in Thailand!',
      message: 'Soon, we will share photos of our intimate wedding in the beautiful Thai landscapes. Stay tuned!'
    }
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
    title: "Nossa História",
    subtitle: "Uma jornada de amor e aventuras",
    firstMeet: {
      title: "Nos conhecemos",
      description: "No colégio em fevereiro de 2010, estudando no IFRJ para ser técnico em Meio-ambiente. Não seguimos essa carreira, mas pelo menos serviu para nos conhecermos."
    },
    firstDate: {
      title: "Primeiro Encontro Oficial",
      description: "Nosso primeiro encontro oficial, sem ser apenas como amigos, foi em março de 2015 num dos lugares que mais gostamos de ir, no cinema."
    },
    livingTogether: {
      title: "Morando Juntos",
      description: "Começamos a morar juntos em 2017 quando a Nadia se mudou para Portugal para seguir o amor de sua vida, Matheus. (Nem dá para saber quem está escrevendo, né?)"
    },
    proposal: {
      title: "O Pedido",
      description: "Bem, a vida é complicada. O primeiro pedido foi em 2018 no Algarve em uma cachoeira, mas éramos jovens e sem muito dinheiro. O segundo foi o da sorte em 2021, para o casamento em 2025."
    },
    civilWedding: {
      title: "Casamento Civil",
      description: "Aconteceu em 2024 uma cerimônia íntima com alguns amigos em Aveiro. Foi simples, mas muito linda!"
    }
  },
  details: {
    title: 'Detalhes do Casamento',
    ceremony: {
      title: 'Cerimônia',
      date: '6 de Março de 2025',
      time: '16:00',
      location: 'Tailândia',
      timezone: {
        title: 'Horários da Cerimônia por Local',
        brazil: '6:00 (Brasil)',
        portugal: '10:00 (Portugal)',
        spain: '11:00 (Espanha)'
      }
    },
    reception: {
      title: 'Recepção',
      date: '06.03.2025',
      time: '19:00',
      location: 'Tailândia',
      address: 'Tailândia'
    },
    accommodation: {
      title: 'Hospedagem',
      description: 'Forneceremos os detalhes da hospedagem mais próximo à data do casamento.'
    },
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
      number: '+351934646436'
    },
    pix: {
      title: 'Pix',
      description: 'Envie seu presente via Pix para:',
      key: 'carvalho.bfr@gmail.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Envie seu presente via Bizum para:',
      number: '+34617384134'
    },
    confirmation: {
      title: 'Presente Enviado!',
      message: 'Obrigado pela sua generosidade!',
      question: 'Gostaria de enviar uma mensagem para os noivos?',
      yes: 'Sim, enviar mensagem',
      no: 'Não, obrigado'
    }
  },
  message: {
    title: 'Mensagem para os Noivos',
    intro: 'Adoraríamos receber sua mensagem! Envie seus votos, pensamentos ou apenas diga olá.',
    donation_note: 'Mensagem enviada após doação via {{paymentMethod}}',
    form: {
      name: 'Seu Nome',
      email: 'Seu Email',
      message: 'Sua Mensagem',
      name_placeholder: 'Seu nome',
      email_placeholder: 'seu.email@exemplo.com',
      message_placeholder: 'Escreva sua mensagem aqui...',
      submit: 'Enviar Mensagem',
      sending: 'Enviando...',
      error: {
        required: 'Por favor, preencha todos os campos obrigatórios',
        email: 'Por favor, insira um endereço de email válido',
        generic: 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.'
      }
    },
    thanks: 'Obrigado pela sua mensagem!',
    confirmation: 'Recebemos sua mensagem e guardaremos suas palavras com carinho.'
  },
  footer: {
    credit: 'Feito com amor, pelos noivos, para o nosso dia especial',
    copyright: '© 2025 Matheus & Nadia'
  },
  gallery: {
    title: 'Galeria',
    imageViewer: 'Visualizador de Imagens',
    empty: {
      title: 'Capturando Momentos Especiais na Tailândia!',
      message: 'Em breve, compartilharemos aqui as fotos do nosso casamento íntimo nas belas paisagens tailandesas. Fique atento!'
    }
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
    title: "Nuestra Historia",
    subtitle: "Un viaje de amor y aventuras",
    firstMeet: {
      title: "Nos conocimos",
      description: "En la escuela en febrero de 2010, estudiando en el IFRJ para ser técnicos ambientales. No seguimos esa carrera, pero al menos sirvió para que nos conociéramos."
    },
    firstDate: {
      title: "Primera Cita Oficial",
      description: "Nuestra primera cita oficial, no solo como amigos, fue en marzo de 2015 en uno de los lugares que más nos gusta ir, el cine."
    },
    livingTogether: {
      title: "Viviendo Juntos",
      description: "Comenzamos a vivir juntos en 2017 cuando Nadia se mudó a Portugal para seguir al amor de su vida, Matheus. (¿No se puede saber quién está escribiendo esto, verdad?)"
    },
    proposal: {
      title: "La Propuesta",
      description: "Bueno, la vida es complicada. La primera propuesta fue en 2018 en el Algarve en una cascada, pero éramos jóvenes y sin mucho dinero. La segunda fue la afortunada en 2021, para la boda en 2025."
    },
    civilWedding: {
      title: "Boda Civil",
      description: "En 2024, se realizó una ceremonia íntima con algunos amigos en Aveiro. Fue simple, ¡pero muy hermosa!"
    }
  },
  details: {
    title: 'Detalles de la Boda',
    ceremony: {
      title: 'Ceremonia',
      date: '6 de Marzo de 2025',
      time: '16:00',
      location: 'Tailandia',
      timezone: {
        title: 'Horarios de la Ceremonia por Localidad',
        brazil: '6:00 (Brasil)',
        portugal: '10:00 (Portugal)',
        spain: '11:00 (España)'
      }
    },
    reception: {
      title: 'Recepción',
      date: '06 de Marzo de 2025',
      time: '19:00',
      location: 'Tailandia',
      address: 'Tailandia'
    },
    accommodation: {
      title: 'Alojamiento',
      description: 'Proporcionaremos los detalles del alojamiento más cerca de la fecha de la boda.'
    },
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
      number: '+351934646436'
    },
    pix: {
      title: 'Pix',
      description: 'Envía tu regalo a través de Pix a:',
      key: 'carvalho.bfr@gmail.com'
    },
    bizum: {
      title: 'Bizum',
      description: 'Envía tu regalo a través de Bizum a:',
      number: '+34617384134'
    },
    confirmation: {
      title: '¡Regalo Enviado!',
      message: '¡Gracias por tu generosidad!',
      question: '¿Te gustaría enviar un mensaje a los novios?',
      yes: 'Sí, enviar mensaje',
      no: 'No, gracias'
    }
  },
  message: {
    title: 'Mensaje para los Novios',
    intro: '¡Nos encantaría saber de ti! Envíanos tus deseos, pensamentos o simplemente salúdanos.',
    donation_note: 'Mensaje enviado después de una donación vía {{paymentMethod}}',
    form: {
      name: 'Su Nombre',
      email: 'Su Email',
      message: 'Su Mensaje',
      name_placeholder: 'Su nombre',
      email_placeholder: 'su.email@ejemplo.com',
      message_placeholder: 'Escriba su mensaje aquí...',
      submit: 'Enviar Mensaje',
      sending: 'Enviando...',
      error: {
        required: 'Por favor, complete todos los campos requeridos',
        email: 'Por favor, ingrese una dirección de correo electrónico válida',
        generic: 'Se produjo un error al enviar el mensaje. Por favor, inténtelo de nuevo.'
      }
    },
    thanks: '¡Gracias por tu mensaje!',
    confirmation: 'Hemos recibido tu mensaje y atesoraremos tus amables palabras.'
  },
  footer: {
    credit: 'Hecho con amor, por los novios, para nuestro día especial',
    copyright: '© 2025 Matheus & Nadia'
  },
  gallery: {
    title: 'Galería',
    imageViewer: 'Visualizador de Imágenes',
    empty: {
      title: '¡Capturando Momentos Especiales en Tailandia!',
      message: 'Pronto, compartiremos aquí las fotos de nuestra boda íntima en los hermosos paisajes tailandeses. ¡Estén atentos!'
    }
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