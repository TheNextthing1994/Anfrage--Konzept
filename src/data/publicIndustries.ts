import type { LocalizedText } from '../components/public/usePublicText';

// Labels and example ideas retained from the owner's original website.
export interface PublicIndustry { id: string; label: LocalizedText; solutions: LocalizedText[] }

export const PUBLIC_INDUSTRIES: PublicIndustry[] = [
  {
    "id": "industry-1",
    "label": [
      "Hautärzte",
      "Дерматологи"
    ],
    "solutions": [
      [
        "Automatisierte Patienten-Triage",
        "Автоматизированная сортировка пациентов"
      ],
      [
        "KI-Telefonassistenz",
        "ИИ-телефонный ассистент"
      ],
      [
        "Digitale Anamnese-Standards",
        "Цифровые стандарты анамнеза"
      ]
    ]
  },
  {
    "id": "industry-2",
    "label": [
      "Frisöre",
      "Парикмахеры"
    ],
    "solutions": [
      [
        "KI-Terminbuchungssystem",
        "Система ИИ-записи"
      ],
      [
        "Automatisierte Kundenbindung",
        "Автоматизированное удержание клиентов"
      ],
      [
        "Bestandsmanagement-KI",
        "ИИ-управление запасами"
      ]
    ]
  },
  {
    "id": "industry-3",
    "label": [
      "Online Shop Owner",
      "Владельцы интернет-магазинов"
    ],
    "solutions": [
      [
        "Personalisierte Kaufberatung",
        "Персонализированные консультации"
      ],
      [
        "KI-gestützte Logistik",
        "ИИ-логистика"
      ],
      [
        "Automatisierter Kundensupport",
        "Автоматизированная поддержка"
      ]
    ]
  },
  {
    "id": "industry-4",
    "label": [
      "Elektriker",
      "Электрики"
    ],
    "solutions": [
      [
        "KI-Kalkulationsassistent",
        "ИИ-калькулятор смет"
      ],
      [
        "Automatisierte Materialbestellung",
        "Автоматизированный заказ материалов"
      ],
      [
        "Digitale Baustellendokumentation",
        "Цифровая документация объекта"
      ]
    ]
  },
  {
    "id": "industry-5",
    "label": [
      "Büromitarbeiter",
      "Офисные сотрудники"
    ],
    "solutions": [
      [
        "Workflow-Automatisierung",
        "Автоматизация рабочих процессов"
      ],
      [
        "KI-Dokumentenanalyse",
        "ИИ-анализ документов"
      ],
      [
        "Intelligente E-Mail-Sortierung",
        "Умная сортировка почты"
      ]
    ]
  },
  {
    "id": "industry-6",
    "label": [
      "Immobilienmakler",
      "Риелторы"
    ],
    "solutions": [
      [
        "KI-Lead-Qualifizierung",
        "ИИ-квалификация лидов"
      ],
      [
        "Automatisierte Exposé-Erstellung",
        "Автоматическое создание объявлений"
      ],
      [
        "Virtuelle Besichtigungs-KI",
        "ИИ-виртуальные туры"
      ]
    ]
  },
  {
    "id": "industry-7",
    "label": [
      "Logistikleiter",
      "Логисты"
    ],
    "solutions": [
      [
        "Routenoptimierung via KI",
        "Оптимизация маршрутов ИИ"
      ],
      [
        "Echtzeit-Materialtracking",
        "Отслеживание материалов в реальном времени"
      ],
      [
        "Automatisierte Lieferketten-Analyse",
        "Автоматический анализ поставок"
      ]
    ]
  },
  {
    "id": "industry-8",
    "label": [
      "Praxispersonal",
      "Медперсонал"
    ],
    "solutions": [
      [
        "KI-gestützte Terminplanung",
        "ИИ-планирование графиков"
      ],
      [
        "Automatisierte Abrechnungshilfe",
        "Автоматизированная помощь в биллинге"
      ],
      [
        "Digitale Patientenakte-KI",
        "ИИ-цифровая медкарта"
      ]
    ]
  },
  {
    "id": "industry-9",
    "label": [
      "E-Commerce Manager",
      "E-Commerce менеджеры"
    ],
    "solutions": [
      [
        "KI-Marketing-Automatisierung",
        "ИИ-маркетинг"
      ],
      [
        "Dynamische Preisgestaltung",
        "Динамическое ценообразование"
      ],
      [
        "KI-Bestandsvorhersage",
        "ИИ-прогноз запасов"
      ]
    ]
  },
  {
    "id": "industry-10",
    "label": [
      "Handwerksmeister",
      "Мастера"
    ],
    "solutions": [
      [
        "KI-Projektplanung",
        "ИИ-планирование проектов"
      ],
      [
        "Automatisierte Zeiterfassung",
        "Автоматический учет времени"
      ],
      [
        "KI-Ressourcenmanagement",
        "ИИ-управление ресурсами"
      ]
    ]
  },
  {
    "id": "industry-11",
    "label": [
      "Finanzberater",
      "Финансовые консультанты"
    ],
    "solutions": [
      [
        "KI-Portfolioanalyse",
        "ИИ-анализ портфеля"
      ],
      [
        "Automatisierte Compliance-Prüfung",
        "Автоматическая проверка комплаенса"
      ],
      [
        "Lead-Generierung via KI",
        "Генерация лидов через ИИ"
      ]
    ]
  },
  {
    "id": "industry-12",
    "label": [
      "Kundenbetreuer",
      "Менеджеры по работе с клиентами"
    ],
    "solutions": [
      [
        "KI-Chatbots & Voice-AI",
        "ИИ-чат-боты и голосовой ИИ"
      ],
      [
        "Automatisierte Ticket-Priorisierung",
        "Автоматическая приоритизация тикетов"
      ],
      [
        "Sentiment-Analyse",
        "Анализ настроений"
      ]
    ]
  },
  {
    "id": "industry-13",
    "label": [
      "Projektleiter",
      "Руководители проектов"
    ],
    "solutions": [
      [
        "KI-Risikoanalyse",
        "ИИ-анализ рисков"
      ],
      [
        "Automatisierte Statusberichte",
        "Автоматические отчеты о статусе"
      ],
      [
        "Ressourcen-Optimierung",
        "Оптимизация ресурсов"
      ]
    ]
  },
  {
    "id": "industry-14",
    "label": [
      "Vertriebsteams",
      "Отделы продаж"
    ],
    "solutions": [
      [
        "KI-Sales-Assistant",
        "ИИ-ассистент по продажам"
      ],
      [
        "Automatisierte Lead-Recherche",
        "Автоматический поиск лидов"
      ],
      [
        "CRM-Datenpflege via KI",
        "ИИ-ведение CRM"
      ]
    ]
  },
  {
    "id": "industry-15",
    "label": [
      "Marketing Agenturen",
      "Маркетинговые агентства"
    ],
    "solutions": [
      [
        "KI-Content-Generierung",
        "ИИ-генерация контента"
      ],
      [
        "Automatisierte Kampagnen-Analyse",
        "Автоматический анализ кампаний"
      ],
      [
        "Trend-Vorhersage via KI",
        "ИИ-прогноз трендов"
      ]
    ]
  },
  {
    "id": "industry-16",
    "label": [
      "Fitnessstudio Besitzer",
      "Владельцы фитнес-клубов"
    ],
    "solutions": [
      [
        "KI-Trainingsplan-Erstellung",
        "ИИ-планы тренировок"
      ],
      [
        "Automatisierte Mitgliederverwaltung",
        "Автоматизация работы с членами клуба"
      ],
      [
        "KI-Churn-Prevention",
        "ИИ-предотвращение оттока"
      ]
    ]
  },
  {
    "id": "industry-17",
    "label": [
      "Gastronomen",
      "Рестораторы"
    ],
    "solutions": [
      [
        "KI-Reservierungsmanagement",
        "ИИ-управление бронированием"
      ],
      [
        "Automatisierte Warenwirtschaft",
        "Автоматизированный складской учет"
      ],
      [
        "KI-Personalplanung",
        "ИИ-планирование персонала"
      ]
    ]
  },
  {
    "id": "industry-18",
    "label": [
      "Architekten",
      "Архитекторы"
    ],
    "solutions": [
      [
        "KI-Design-Optimierung",
        "ИИ-оптимизация дизайна"
      ],
      [
        "Automatisierte Normenprüfung",
        "Автоматическая проверка норм"
      ],
      [
        "KI-Projektkosten-Kalkulation",
        "ИИ-расчет стоимости проекта"
      ]
    ]
  },
  {
    "id": "industry-19",
    "label": [
      "Rechtsanwälte",
      "Юристы"
    ],
    "solutions": [
      [
        "KI-Vertragsanalyse",
        "ИИ-анализ контрактов"
      ],
      [
        "Automatisierte Fristenkontrolle",
        "Автоматический контроль сроков"
      ],
      [
        "Rechtsprechungs-Recherche via KI",
        "ИИ-поиск судебной практики"
      ]
    ]
  },
  {
    "id": "industry-20",
    "label": [
      "Steuerberater",
      "Налоговые консультанты"
    ],
    "solutions": [
      [
        "KI-Belegprüfung",
        "ИИ-проверка документов"
      ],
      [
        "Automatisierte Steuerprognose",
        "Автоматический налоговый прогноз"
      ],
      [
        "Digitale Buchhaltungs-KI",
        "ИИ-цифровая бухгалтерия"
      ]
    ]
  }
];
