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
      location: 'Thailand'
    },
    accommodation: {
      title: 'Accommodation',
      description: 'We will provide accommodation details closer to the wedding date.'
    }
  },
  gifts: {
    title: 'Wedding Gifts',
    intro: 'Instead of traditional gifts, we invite you to contribute to our honeymoon in Thailand. From simple experiences like a local coffee or street Pad Thai to more elaborate ones like a boat ride or an elephant sanctuary visit!',
    selectedActivitiesTitle: 'Selected Activities',
    emptySelection: 'You have not selected any activity yet.',
    emptySelectionHelp: 'Click on the cards above to choose the experiences you wish to gift us.',
    totalAmount: 'Total Amount:',
    proceedToPayment: 'Proceed to Payment',
    selectedBadge: 'Selected',
    customContributionLabel: 'Contribution Value',
    add: 'Add',
    remove: 'Remove',
    paymentModal: {
      title: 'Choose Payment Method',
      totalLabel: 'Total Amount:',
      confirmPayment: 'Confirm Payment',
      processing: 'Processing...',
      close: 'Close'
    },
    confirmationModal: {
      title: 'Payment Confirmed',
      thankYou: 'Thank you for your gift!',
      message: 'We have received your contribution for our honeymoon in Thailand. We deeply appreciate you being part of this special moment in our lives.',
      close: 'Close'
    }
  },
  message: {
    title: 'Message to the Couple',
    intro: 'We would love to hear from you! Send us your wishes, thoughts, or simply say hello.',
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
    credit: 'Made with love by the couple for our special day',
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
    }
  },
  gifts: {
    title: 'Presentes de Casamento',
    intro: 'Em vez de presentes tradicionais, convidamos você a contribuir para nossa lua de mel na Tailândia. Das experiências simples, como um café local ou um Pad Thai de rua, às mais elaboradas, como um passeio de barco ou uma visita ao santuário de elefantes!',
    selectedActivitiesTitle: 'Atividades Selecionadas',
    emptySelection: 'Você ainda não selecionou nenhuma atividade.',
    emptySelectionHelp: 'Clique nos cards acima para selecionar as experiências que deseja nos presentear.',
    totalAmount: 'Valor Total:',
    proceedToPayment: 'Prosseguir para Pagamento',
    selectedBadge: 'Selecionado',
    customContributionLabel: 'Valor da Contribuição',
    add: 'Adicionar',
    remove: 'Remover',
    paymentModal: {
      title: 'Escolha o Método de Pagamento',
      totalLabel: 'Valor total:',
      confirmPayment: 'Confirmar Pagamento',
      processing: 'Processando...',
      close: 'Fechar'
    },
    confirmationModal: {
      title: 'Pagamento Confirmado',
      thankYou: 'Obrigado pelo seu presente!',
      message: 'Recebemos sua contribuição para nossa lua de mel na Tailândia. Agradecemos imensamente por fazer parte deste momento especial em nossas vidas.',
      close: 'Fechar'
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
    }
  },
  gifts: {
    title: 'Regalos de Boda',
    intro: 'En lugar de regalos tradicionales, te invitamos a contribuir a nuestra luna de miel en Tailandia. Desde experiencias sencillas como un café local o un Pad Thai callejero, hasta opciones más elaboradas como un paseo en barco o una visita a un santuario de elefantes.',
    selectedActivitiesTitle: 'Actividades Seleccionadas',
    emptySelection: 'Aún no has seleccionado ninguna actividad.',
    emptySelectionHelp: 'Haz clic en las tarjetas arriba para seleccionar las experiencias que deseas regalarnos.',
    totalAmount: 'Monto Total:',
    proceedToPayment: 'Proceder al Pago',
    selectedBadge: 'Seleccionado',
    customContributionLabel: 'Valor de Contribución',
    add: 'Añadir',
    remove: 'Eliminar',
    paymentModal: {
      title: 'Elige el Método de Pago',
      totalLabel: 'Monto total:',
      confirmPayment: 'Confirmar Pago',
      processing: 'Procesando...',
      close: 'Cerrar'
    },
    confirmationModal: {
      title: 'Pago Confirmado',
      thankYou: '¡Gracias por tu regalo!',
      message: 'Hemos recibido tu contribución para nuestra luna de miel en Tailandia. Agradecemos profundamente que formes parte de este momento tan especial en nuestras vidas.',
      close: 'Cerrar'
    }
  },
  message: {
    title: 'Mensaje para los Novios',
    intro: '¡Nos encantaría saber de ti! Envíanos tus deseos, pensamientos o simplemente salúdanos.',
    donation_note: 'Mensaje enviado después de una donación vía {{paymentMethod}}',
    form: {
      name: 'Tu Nombre',
      email: 'Tu Email',
      message: 'Tu Mensaje',
      name_placeholder: 'Tu nombre',
      email_placeholder: 'tu.email@ejemplo.com',
      message_placeholder: 'Escribe tu mensaje aquí...',
      submit: 'Enviar Mensaje',
      sending: 'Enviando...',
      error: {
        required: 'Por favor, completa todos los campos requeridos',
        email: 'Por favor, ingresa un email válido',
        generic: 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
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
      message: 'Pronto compartiremos las fotos de nuestra boda íntima en los hermosos paisajes de Tailandia. ¡Estén atentos!'
    }
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    pt: { translation: ptTranslations },
    es: { translation: esTranslations }
  },
  lng: 'pt', // língua padrão
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
