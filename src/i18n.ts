import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      faq: {
        title1: "Вопрос",
        title2: "Ответ",
        subtitle: "Кратко о самом важном",
        q1: "Сколько стоит установка видеонаблюдения?",
        a1: "Стоимость проекта всегда индивидуальна. Она складывается из цены выбранного оборудования (разрешение камер, глубина архива) и сложности монтажных работ. Мы подготовим для вас 3 варианта сметы под разный бюджет в течение дня.",
        q2: "Можно ли смотреть камеры с телефона?",
        a2: "Безусловно. Мы устанавливаем и настраиваем защищенное мобильное приложение, которое позволяет смотреть онлайн-трансляцию и архив записей из любой точки мира, где есть интернет.",
        q3: "Предоставляете ли вы гарантию?",
        a3: "Да, мы работаем официально. Гарантия на оборудование составляет от 1 до 3 лет (в зависимости от бренда), а гарантия на наши монтажные работы — 12 месяцев.",
        q4: "Как быстро вы приступаете к работе?",
        a4: "Обычно монтаж начинается в течение 2-3 рабочих дней после согласования сметы и внесения предоплаты. Небольшие объекты (до 4 камер) закрываем за один рабочий день.",
        q5: "Можно ли установить скрытое видеонаблюдение?",
        a5: "Нет, установка скрытого видеонаблюдения частными лицами и организациями в РК запрещена законом. Согласно ст. 147 УК РК, использование специальных технических средств для негласного получения информации преследуется по закону. Мы устанавливаем только открытые системы с обязательным размещением предупреждающих табличек.",
        q6: "Работает ли система при отключении электричества?",
        a6: "Стандартные системы зависят от сети, но мы рекомендуем установку блоков бесперебойного питания (ИБП). С ними система продолжит запись от 2 до 8 часов (в зависимости от емкости АКБ) после отключения света, что критично для безопасности в ночное время.",
        q7: "Нужно ли мне самому покупать кабели и жесткие диски?",
        a7: "Нет, мы берем на себя полную комплектацию объекта «под ключ». Мы используем только специализированные жесткие диски для систем видеонаблюдения (серии WD Purple или Seagate SkyHawk), которые рассчитаны на круглосуточную перезапись 24/7, в отличие от обычных компьютерных дисков.",
        q8: "Записывает ли камера звук?",
        a8: "Зависит от выбранной модели. Мы можем установить камеры со встроенными микрофонами или подключить внешние активные микрофоны. Это часто требуется на кассах или в зонах приема клиентов для контроля качества обслуживания и решения спорных ситуаций.",
        q9: "Что делать, если пропадет интернет?",
        a9: "Запись не прервется. Видео будет продолжать сохраняться на локальный регистратор (NVR/DVR) или SD-карту внутри камеры. Как только интернет-соединение восстановится, вы снова сможете просматривать архив удаленно через приложение.",
        q10: "Обучаете ли вы пользоваться системой?",
        a10: "Да, это обязательная часть нашей работы. После монтажа мы устанавливаем приложение на все ваши устройства, настраиваем уведомления о движении и проводим краткий инструктаж: как смотреть онлайн, как найти нужный фрагмент в архиве и как скачать его на телефон."
      },
      footer: {
        brand1: "Система безопасности",
        brand2: "Актау",
        desc: "Профессиональные решения в области безопасности и IT-инфраструктуры с 2016 года.",
        nav_title: "Навигация",
        contacts_title: "Контакты",
        settings_title: "Настройки",
        copyright: `© ${new Date().getFullYear()} ТОО "СИСТЕМА БЕЗОПАСНОСТИ АКТАУ". ВСЕ ПРАВА ЗАЩИЩЕНЫ.`,
        love: "С любовью от"
      },
      nav: {
        services: "Услуги",
        projects: "Проекты",
        about: "О компании",
        contact: "Связаться"
      },
      docs: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        dpa: "DPA Agreement",
        privacy_title: "Политика конфиденциальности",
        terms_title: "Условия обслуживания",
        dpa_title: "Соглашение об обработке данных",
        updated: "Последнее обновление: 8 марта 2026 г.",
        privacy_1_title: "1. Сбор данных",
        privacy_1_desc: "Мы собираем ФИО, номер телефона и адрес объекта исключительно для обработки заявок и оказания услуг по установке систем безопасности.",
        privacy_2_title: "2. Использование данных",
        privacy_2_desc: "Данные используются для связи с клиентом, подготовки коммерческих предложений и технической поддержки установленного оборудования.",
        privacy_3_title: "3. Защита информации",
        privacy_3_desc: "Ваши данные хранятся на защищенных серверах. Мы не передаем информацию третьим лицам, за исключением случаев, предусмотренных законодательством РК.",
        terms_1_title: "1. Общие положения",
        terms_1_desc: "Использование данного сайта означает ваше согласие с условиями оказания услуг компании SBA.",
        terms_2_title: "2. Оказание услуг",
        terms_2_desc: "Все работы по монтажу и настройке систем производятся на основании отдельного договора подряда. Информация на сайте носит ознакомительный характер.",
        terms_3_title: "3. Ответственность",
        terms_3_desc: "SBA не несет ответственности за перебои в работе систем, вызванные отсутствием интернета на стороне клиента или неисправностью стороннего оборудования.",
        dpa_1_title: "1. Предмет DPA",
        dpa_1_desc: "Настоящее соглашение регулирует обработку персональных данных (включая видеопотоки) в рамках эксплуатации систем видеонаблюдения.",
        dpa_2_title: "2. Обязанности обработчика",
        dpa_2_desc: "SBA обязуется обеспечить конфиденциальность доступа к облачным сервисам видеомониторинга и ограничивать доступ сотрудников к архивам клиента.",
        dpa_3_title: "3. Биометрические данные",
        dpa_3_desc: "Клиент подтверждает, что получил согласие субъектов (сотрудников/посетителей) на ведение видеосъемки на объекте согласно Закону РК «О персональных данных».",
        footer_note: "Документация подготовлена для проекта «Система Безопасности Актау» группой разработки RS STUDIO."
      }
    }
  },
  kz: {
    translation: {
      faq: {
        title1: "Сұрақ",
        title2: "Жауап",
        subtitle: "Ең маңыздысы туралы қысқаша",
        q1: "Бейнебақылау орнату қанша тұрады?",
        a1: "Жобаның құны әрқашан жеке есептеледі. Ол таңдалған жабдықтың бағасына (камералардың ажыратымдылығы, мұрағат тереңдігі) және монтаждау жұмыстарының күрделілігіне байланысты. Біз бір күн ішінде әртүрлі бюджетке арналған сметаның 3 нұсқасын дайындаймыз.",
        q2: "Камераларды телефоннан көруге бола ма?",
        a2: "Әрине. Біз әлемнің кез келген нүктесінен (интернет бар жерде) онлайн-трансляцияны және жазбалар мұрағатын көруге мүмкіндік беретін қорғалған мобильді қосымшаны орнатып, баптаймыз.",
        q3: "Кепілдік бересіздер ме?",
        a3: "Иә, біз ресми түрде жұмыс істейміз. Жабдыққа кепілдік 1 жылдан 3 жылға дейін (брендке байланысты), ал монтаждау жұмыстарына кепілдік — 12 ай.",
        q4: "Жұмысты қаншалықты тез бастайсыздар?",
        a4: "Әдетте монтаждау сметаны келіскеннен және алдын ала төлем жасағаннан кейін 2-3 жұмыс күні ішінде басталады. Шағын нысандарды (4 камераға дейін) бір жұмыс күнінде бітіреміз.",
        q5: "Жасырын бейнебақылау орнатуға бола ма?",
        a5: "Жоқ, жеке тұлғалар мен ұйымдарға жасырын бейнебақылау орнатуға ҚР заңнамасымен тыйым салынған. ҚР ҚК 147-бабына сәйкес, ақпаратты жасырын алу үшін арнайы техникалық құралдарды пайдалану заңмен қудаланады. Біз тек ескерту тақтайшаларын міндетті түрде орналастыра отырып, ашық жүйелерді орнатамыз.",
        q6: "Электр жарығы сөнген кезде жүйе жұмыс істей ме?",
        a6: "Стандартты жүйелер желіге тәуелді, бірақ біз үздіксіз қуат көздерін (ҮҚК/UPS) орнатуды ұсынамыз. Олармен жүйе жарық сөнгеннен кейін де 2-ден 8 сағатқа дейін (аккумулятор сыйымдылығына байланысты) жазуды жалғастырады, бұл түнгі уақыттағы қауіпсіздік үшін өте маңызды.",
        q7: "Кабельдер мен қатты дискілерді өзім сатып алуым керек пе?",
        a7: "Жоқ, біз нысанды «толық дайын» күйінде тапсыруды өз мойнымызға аламыз. Біз қарапайым компьютерлік дискілерден айырмашылығы, 24/7 режимінде үздіксіз қайта жазуға арналған бейнебақылау жүйелеріне арналған арнайы қатты дискілерді (WD Purple немесе Seagate SkyHawk сериялары) ғана пайдаланамыз.",
        q8: "Камера дыбыс жаза ма?",
        a8: "Таңдалған модельге байланысты. Біз кіріктірілген микрофоны бар камераларды орната аламыз немесе сыртқы белсенді микрофондарды қоса аламыз. Бұл қызмет көрсету сапасын бақылау және даулы жағдайларды шешу үшін кассаларда немесе клиенттерді қабылдау аймақтарында жиі қажет.",
        q9: "Интернет жоғалып кетсе не істеу керек?",
        a9: "Жазу тоқтамайды. Бейне жергілікті тіркеушіге (NVR/DVR) немесе камера ішіндегі SD-картаға сақталуын жалғастырады. Интернет байланысы қалпына келген бойда, сіз қосымша арқылы мұрағатты қайтадан қашықтан көре аласыз.",
        q10: "Жүйені пайдалануды үйретесіздер ме?",
        a10: "Иә, бұл біздің жұмысымыздың міндетті бөлігі. Монтаждаудан кейін біз барлық құрылғыларыңызға қосымшаны орнатамыз, қозғалыс туралы хабарламаларды баптаймыз және қысқаша нұсқаулық жүргіземіз: онлайн қалай көруге болады, мұрағаттан қажетті үзіндіні қалай табуға болады және оны телефонға қалай жүктеп алуға болады."
      },
      footer: {
        brand1: "Қауіпсіздік жүйесі",
        brand2: "Ақтау",
        desc: "2016 жылдан бастап қауіпсіздік және IT-инфрақұрылым саласындағы кәсіби шешімдер.",
        nav_title: "Навигация",
        contacts_title: "Байланыс",
        settings_title: "Баптаулар",
        copyright: `© ${new Date().getFullYear()} "АҚТАУ ҚАУІПСІЗДІК ЖҮЙЕСІ" ЖШС. БАРЛЫҚ ҚҰҚЫҚТАР ҚОРҒАЛҒАН.`,
        love: "Сүйіспеншілікпен"
      },
      nav: {
        services: "Қызметтер",
        projects: "Жобалар",
        about: "Компания туралы",
        contact: "Байланыс"
      },
      docs: {
        privacy: "Құпиялылық саясаты",
        terms: "Қызмет көрсету шарттары",
        dpa: "Деректерді өңдеу келісімі",
        privacy_title: "Құпиялылық саясаты",
        terms_title: "Қызмет көрсету шарттары",
        dpa_title: "Деректерді өңдеу келісімі (DPA)",
        updated: "Соңғы жаңарту: 8 наурыз 2026 ж.",
        privacy_1_title: "1. Деректерді жинау",
        privacy_1_desc: "Біз өтінімдерді өңдеу және қауіпсіздік жүйелерін орнату бойынша қызмет көрсету үшін ғана АЖТ, телефон нөмірін және нысанның мекенжайын жинаймыз.",
        privacy_2_title: "2. Деректерді пайдалану",
        privacy_2_desc: "Деректер клиентпен байланысу, коммерциялық ұсыныстар дайындау және орнатылған жабдыққа техникалық қолдау көрсету үшін пайдаланылады.",
        privacy_3_title: "3. Ақпаратты қорғау",
        privacy_3_desc: "Сіздің деректеріңіз қорғалған серверлерде сақталады. ҚР заңнамасында көзделген жағдайларды қоспағанда, біз ақпаратты үшінші тұлғаларға бермейміз.",
        terms_1_title: "1. Жалпы ережелер",
        terms_1_desc: "Осы сайтты пайдалану сіздің SBA компаниясының қызмет көрсету шарттарымен келісетіндігіңізді білдіреді.",
        terms_2_title: "2. Қызмет көрсету",
        terms_2_desc: "Жүйелерді монтаждау және баптау бойынша барлық жұмыстар жеке мердігерлік шарт негізінде жүргізіледі. Сайттағы ақпарат танысу сипатында берілген.",
        terms_3_title: "3. Жауапкершілік",
        terms_3_desc: "SBA клиент жағында интернеттің болмауынан немесе бөгде жабдықтың ақаулығынан туындаған жүйелер жұмысындағы іркілістер үшін жауап бермейді.",
        dpa_1_title: "1. DPA пәні",
        dpa_1_desc: "Осы келісім бейнебақылау жүйелерін пайдалану шеңберінде дербес деректерді (бейнеағындарды қоса алғанда) өңдеуді реттейді.",
        dpa_2_title: "2. Өңдеушінің міндеттері",
        dpa_2_desc: "SBA бұлтты бейнемониторинг сервистеріне қол жеткізудің құпиялылығын қамтамасыз етуге және қызметкерлердің клиент мұрағаттарына қолжетімділігін шектеуге міндеттенеді.",
        dpa_3_title: "3. Биометриялық деректер",
        dpa_3_desc: "Клиент ҚР «Дербес деректер туралы» Заңына сәйкес нысанда бейнетүсірілім жүргізуге субъектілердің (қызметкерлердің/келушілердің) келісімін алғанын растайды.",
        footer_note: "Құжаттаманы «Ақтау Қауіпсіздік Жүйесі» жобасы үшін RS STUDIO әзірлеу тобы дайындады."
      }
    }
  },
  en: {
    translation: {
      faq: {
        title1: "Q&",
        title2: "A",
        subtitle: "Briefly about the most important",
        q1: "How much does CCTV installation cost?",
        a1: "The project cost is always individual. It consists of the price of the selected equipment (camera resolution, archive depth) and the complexity of the installation work. We will prepare 3 estimate options for different budgets within a day.",
        q2: "Can I view the cameras from my phone?",
        a2: "Absolutely. We install and configure a secure mobile app that allows you to watch live streams and video archives from anywhere in the world with internet access.",
        q3: "Do you provide a warranty?",
        a3: "Yes, we work officially. The equipment warranty ranges from 1 to 3 years (depending on the brand), and the warranty for our installation work is 12 months.",
        q4: "How quickly do you start working?",
        a4: "Usually, installation begins within 2-3 business days after the estimate is approved and the prepayment is made. Small sites (up to 4 cameras) are completed in one working day.",
        q5: "Is it possible to install hidden video surveillance?",
        a5: "No, the installation of hidden video surveillance by individuals and organizations in the Republic of Kazakhstan is prohibited by law. According to Article 147 of the Criminal Code of the Republic of Kazakhstan, the use of special technical means to secretly obtain information is prosecuted. We install only open systems with mandatory warning signs.",
        q6: "Does the system work during a power outage?",
        a6: "Standard systems depend on the power grid, but we recommend installing Uninterruptible Power Supplies (UPS). With them, the system will continue recording for 2 to 8 hours (depending on the battery capacity) after a power outage, which is critical for security at night.",
        q7: "Do I need to buy cables and hard drives myself?",
        a7: "No, we take care of the complete set of the object \"turnkey\". We only use specialized hard drives for video surveillance systems (WD Purple or Seagate SkyHawk series), which are designed for continuous 24/7 recording, unlike conventional computer drives.",
        q8: "Does the camera record sound?",
        a8: "Depends on the selected model. We can install cameras with built-in microphones or connect external active microphones. This is often required at cash registers or customer reception areas to control service quality and resolve disputes.",
        q9: "What if the internet goes down?",
        a9: "Recording will not stop. The video will continue to be saved on the local recorder (NVR/DVR) or SD card inside the camera. As soon as the internet connection is restored, you will be able to view the archive remotely via the app again.",
        q10: "Do you teach how to use the system?",
        a10: "Yes, this is a mandatory part of our work. After installation, we install the app on all your devices, configure motion notifications, and provide a brief briefing: how to watch online, how to find the required fragment in the archive, and how to download it to your phone."
      },
      footer: {
        brand1: "Security System",
        brand2: "Aktau",
        desc: "Professional solutions in security and IT infrastructure since 2016.",
        nav_title: "Navigation",
        contacts_title: "Contacts",
        settings_title: "Settings",
        copyright: `© ${new Date().getFullYear()} "AKTAU SECURITY SYSTEM" LLP. ALL RIGHTS RESERVED.`,
        love: "Made with love by"
      },
      nav: {
        services: "Services",
        projects: "Projects",
        about: "About Us",
        contact: "Contact Us"
      },
      docs: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        dpa: "DPA Agreement",
        privacy_title: "Privacy Policy",
        terms_title: "Terms of Service",
        dpa_title: "Data Processing Agreement",
        updated: "Last updated: March 8, 2026",
        privacy_1_title: "1. Data Collection",
        privacy_1_desc: "We collect full names, phone numbers, and object addresses solely for processing requests and providing security system installation services.",
        privacy_2_title: "2. Data Usage",
        privacy_2_desc: "The data is used to contact the client, prepare commercial offers, and provide technical support for the installed equipment.",
        privacy_3_title: "3. Information Protection",
        privacy_3_desc: "Your data is stored on secure servers. We do not transfer information to third parties, except in cases stipulated by the legislation of the Republic of Kazakhstan.",
        terms_1_title: "1. General Provisions",
        terms_1_desc: "Using this site means your agreement to the terms of service of the SBA company.",
        terms_2_title: "2. Provision of Services",
        terms_2_desc: "All work on the installation and configuration of systems is carried out on the basis of a separate contract. The information on the site is for informational purposes.",
        terms_3_title: "3. Liability",
        terms_3_desc: "SBA is not responsible for interruptions in the operation of systems caused by the lack of internet on the client's side or the malfunction of third-party equipment.",
        dpa_1_title: "1. Subject of DPA",
        dpa_1_desc: "This agreement regulates the processing of personal data (including video streams) as part of the operation of video surveillance systems.",
        dpa_2_title: "2. Processor Obligations",
        dpa_2_desc: "SBA undertakes to ensure the confidentiality of access to cloud video monitoring services and limit employee access to client archives.",
        dpa_3_title: "3. Biometric Data",
        dpa_3_desc: "The client confirms that they have received the consent of the subjects (employees/visitors) for video filming at the facility in accordance with the Law of the Republic of Kazakhstan \"On Personal Data\".",
        footer_note: "Documentation prepared for the project \"Security System Aktau\" by the RS STUDIO development group."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;