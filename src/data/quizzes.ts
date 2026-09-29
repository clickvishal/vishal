import { Quiz, CategoryInfo } from '../types/quiz';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    name: 'General Knowledge',
    description: 'Broaden your horizons across trivia, culture, and general world facts.',
    icon: 'Compass',
    quizCount: 2,
    accentColor: '#4f46e5',
  },
  {
    name: 'Science',
    description: 'Explore physics, chemistry, biology, and the wonders of the universe.',
    icon: 'Atom',
    quizCount: 2,
    accentColor: '#0ea5e9',
  },
  {
    name: 'Technology',
    description: 'Test your understanding of software, internet evolution, and modern tech.',
    icon: 'Cpu',
    quizCount: 2,
    accentColor: '#059669',
  },
  {
    name: 'History',
    description: 'Travel back in time through ancient empires, pivotal treaties, and eras.',
    icon: 'Landmark',
    quizCount: 1,
    accentColor: '#d97706',
  },
  {
    name: 'Geography',
    description: 'From majestic mountain ranges to capitals, flags, and coastlines.',
    icon: 'Globe2',
    quizCount: 1,
    accentColor: '#2563eb',
  },
  {
    name: 'Sports',
    description: 'Athletic history, Olympic milestones, soccer, tennis, and championships.',
    icon: 'Trophy',
    quizCount: 1,
    accentColor: '#dc2626',
  },
  {
    name: 'Movies',
    description: 'Cinema classics, directors, Academy Awards, and iconic film lines.',
    icon: 'Film',
    quizCount: 1,
    accentColor: '#9333ea',
  },
  {
    name: 'Personality',
    description: 'Discover your cognitive style, decision-making strengths, and traits.',
    icon: 'Sparkles',
    quizCount: 1,
    accentColor: '#0891b2',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  // 1. General Knowledge Challenge
  {
    id: 'general-knowledge-challenge',
    title: 'General Knowledge Challenge',
    description: 'A comprehensive trivia test spanning literature, world traditions, astronomy, and classical art.',
    category: 'General Knowledge',
    difficulty: 'Medium',
    questionCount: 10,
    estimatedTime: '6 min',
    featured: true,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-01',
    published: true,
    coverImage: '/src/assets/images/quiz_card_thinker_1790691653000.jpg',
    questions: [
      {
        id: 'gk-1',
        text: 'Which metal remains in a liquid state under standard room temperature and pressure?',
        options: ['Mercury', 'Gallium', 'Bromine', 'Cesium'],
        correctAnswer: 0,
        explanation: 'Mercury (Hg) has a melting point of -38.83 °C, making it the only metallic element liquid at standard room temperature.'
      },
      {
        id: 'gk-2',
        text: 'Who wrote the epic masterpiece novel "One Hundred Years of Solitude"?',
        options: ['Jorge Luis Borges', 'Gabriel García Márquez', 'Pablo Neruda', 'Mario Vargas Llosa'],
        correctAnswer: 1,
        explanation: 'Gabriel García Márquez published the seminal magical realist novel in 1967, later winning the 1982 Nobel Prize in Literature.'
      },
      {
        id: 'gk-3',
        text: 'What is the rarest naturally occurring blood type in the human ABO and Rh blood group system?',
        options: ['O-negative', 'B-negative', 'AB-negative', 'A-negative'],
        correctAnswer: 2,
        explanation: 'AB-negative is found in less than 1% of the global human population, making it the rarest of the eight major blood groups.'
      },
      {
        id: 'gk-4',
        text: 'The historic Rosetta Stone played an instrumental role in deciphering which ancient script?',
        options: ['Sumerian Cuneiform', 'Egyptian Hieroglyphs', 'Linear B', 'Mayan Glyphs'],
        correctAnswer: 1,
        explanation: 'Discovered in 1799, the Rosetta Stone contained the same decree in Ancient Egyptian hieroglyphs, Demotic, and Ancient Greek, unlocking ancient Egyptian writings.'
      },
      {
        id: 'gk-5',
        text: 'Which architectural wonder was commissioned by Mughal Emperor Shah Jahan as a mausoleum for his favorite wife?',
        options: ['Red Fort', 'Humayun’s Tomb', 'Taj Mahal', 'Fatehpur Sikri'],
        correctAnswer: 2,
        explanation: 'The Taj Mahal in Agra, India, was built between 1632 and 1653 in memory of Mumtaz Mahal.'
      },
      {
        id: 'gk-6',
        text: 'In music theory, what interval exists between Middle C and the G immediately above it?',
        options: ['Major Third', 'Perfect Fourth', 'Perfect Fifth', 'Major Sixth'],
        correctAnswer: 2,
        explanation: 'From C to G spans seven semitones, constituting a pure Perfect Fifth interval.'
      },
      {
        id: 'gk-7',
        text: 'Which treaty signed in 1919 officially brought an end to the state of war between Germany and the Allied Powers in World War I?',
        options: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of Ghent', 'Treaty of Utrecht'],
        correctAnswer: 1,
        explanation: 'The Treaty of Versailles was signed on June 28, 1919 in the Hall of Mirrors at the Palace of Versailles.'
      },
      {
        id: 'gk-8',
        text: 'What is the deepest known oceanic trench on planet Earth?',
        options: ['Tonga Trench', 'Puerto Rico Trench', 'Mariana Trench', 'Java Trench'],
        correctAnswer: 2,
        explanation: 'The Mariana Trench in the western Pacific reaches a maximum depth of approximately 10,994 meters (36,070 feet) at Challenger Deep.'
      },
      {
        id: 'gk-9',
        text: 'Which atmospheric gas constitutes approximately 78% of Earth’s atmosphere by volume?',
        options: ['Oxygen', 'Nitrogen', 'Argon', 'Carbon Dioxide'],
        correctAnswer: 1,
        explanation: 'Earth’s dry atmosphere consists of roughly 78.08% nitrogen, 20.95% oxygen, 0.93% argon, and trace amounts of other gases.'
      },
      {
        id: 'gk-10',
        text: 'In classical philosophy, which philosopher was the mentor and teacher of Plato in Athens?',
        options: ['Aristotle', 'Socrates', 'Pythagoras', 'Epicurus'],
        correctAnswer: 1,
        explanation: 'Socrates was the foundational mentor of Plato, who subsequently went on to establish the Academy and teach Aristotle.'
      }
    ]
  },

  // 2. World Geography Quiz
  {
    id: 'world-geography-quiz',
    title: 'World Geography Quiz',
    description: 'Traverse continents, archipelagos, sovereign borders, and international physical geography.',
    category: 'Geography',
    difficulty: 'Medium',
    questionCount: 10,
    estimatedTime: '5 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-03',
    published: true,
    coverImage: '/src/assets/images/quiz_card_geography_1790691667657.jpg',
    questions: [
      {
        id: 'geo-1',
        text: 'What is the only country in the world that borders both the Caspian Sea and the Persian Gulf?',
        options: ['Iraq', 'Iran', 'Saudi Arabia', 'Turkmenistan'],
        correctAnswer: 1,
        explanation: 'Iran is situated strategically between the Caspian Sea to the north and the Persian Gulf and Gulf of Oman to the south.'
      },
      {
        id: 'geo-2',
        text: 'Which is the longest continental mountain range in the world?',
        options: ['The Himalayas', 'The Rocky Mountains', 'The Andes', 'The Urals'],
        correctAnswer: 2,
        explanation: 'The Andes span over 7,000 kilometers (4,350 miles) along the western coast of South America across seven countries.'
      },
      {
        id: 'geo-3',
        text: 'What sovereign nation consists of the largest number of islands in the world (over 260,000)?',
        options: ['Indonesia', 'Philippines', 'Sweden', 'Finland'],
        correctAnswer: 2,
        explanation: 'Sweden holds the world record with approximately 267,570 islands, though fewer than 1,000 are actively inhabited.'
      },
      {
        id: 'geo-4',
        text: 'Which African capital city is renowned as the highest capital city in Africa by elevation?',
        options: ['Nairobi, Kenya', 'Addis Ababa, Ethiopia', 'Pretoria, South Africa', 'Kigali, Rwanda'],
        correctAnswer: 1,
        explanation: 'Addis Ababa stands at roughly 2,355 meters (7,726 feet) above sea level in the Ethiopian highlands.'
      },
      {
        id: 'geo-5',
        text: 'The Strait of Gibraltar connects the Atlantic Ocean directly to which body of water?',
        options: ['The Black Sea', 'The Red Sea', 'The Mediterranean Sea', 'The Baltic Sea'],
        correctAnswer: 2,
        explanation: 'The narrow Strait of Gibraltar (14 km wide at its narrowest point) connects the Atlantic Ocean to the Mediterranean Sea.'
      },
      {
        id: 'geo-6',
        text: 'Which desert is recognized as the driest non-polar desert on Earth, with weather stations recording zero rainfall for decades?',
        options: ['Sahara Desert', 'Atacama Desert', 'Gobi Desert', 'Kalahari Desert'],
        correctAnswer: 1,
        explanation: 'Chile’s Atacama Desert is situated between two mountain chains that block moisture from both the Pacific and Amazon basins.'
      },
      {
        id: 'geo-7',
        text: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctAnswer: 2,
        explanation: 'Canberra was chosen as a compromise capital in 1908 between rivals Sydney and Melbourne.'
      },
      {
        id: 'geo-8',
        text: 'Which river flows through the greatest number of sovereign countries (10 countries) in the world?',
        options: ['The Nile', 'The Amazon', 'The Danube', 'The Rhine'],
        correctAnswer: 2,
        explanation: 'The Danube flows through Germany, Austria, Slovakia, Hungary, Croatia, Serbia, Romania, Bulgaria, Moldova, and Ukraine.'
      },
      {
        id: 'geo-9',
        text: 'Which island is the largest island in the world that is not considered an independent continent?',
        options: ['New Guinea', 'Borneo', 'Madagascar', 'Greenland'],
        correctAnswer: 3,
        explanation: 'Greenland covers 2,166,086 square kilometers, making it the largest non-continental island on Earth.'
      },
      {
        id: 'geo-10',
        text: 'Mount Kilimanjaro, the highest free-standing mountain in the world, is located in which country?',
        options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'],
        correctAnswer: 1,
        explanation: 'Mount Kilimanjaro rises to 5,895 meters (19,341 feet) in north-eastern Tanzania near the Kenyan border.'
      }
    ]
  },

  // 3. Science & Technology Quiz
  {
    id: 'science-and-technology-quiz',
    title: 'Science & Technology Quiz',
    description: 'From quantum particles and thermodynamics to genetics and breakthrough engineering.',
    category: 'Science',
    difficulty: 'Hard',
    questionCount: 10,
    estimatedTime: '7 min',
    featured: true,
    popular: false,
    isDaily: false,
    createdAt: '2026-09-05',
    published: true,
    coverImage: '/src/assets/images/quiznova_hero_illustration_1790690726231.jpg',
    questions: [
      {
        id: 'scitech-1',
        text: 'What fundamental force of nature is mediated by massless gauge bosons known as gluons?',
        options: ['Gravitational Force', 'Electromagnetic Force', 'Weak Nuclear Force', 'Strong Nuclear Force'],
        correctAnswer: 3,
        explanation: 'Gluons act as exchange particles for the strong force that binds quarks together to form protons and neutrons.'
      },
      {
        id: 'scitech-2',
        text: 'Which molecular tool derived from bacterial immune systems revolutionized targeted genome editing?',
        options: ['TALENs', 'Zinc Finger Nucleases', 'CRISPR-Cas9', 'Restriction Endonucleases'],
        correctAnswer: 2,
        explanation: 'CRISPR-Cas9 enables precise RNA-guided cutting and modification of specific genomic DNA sequences in living organisms.'
      },
      {
        id: 'scitech-3',
        text: 'In thermodynamics, what quantity of an isolated system always increases or remains constant in any spontaneous process?',
        options: ['Enthalpy', 'Entropy', 'Gibbs Free Energy', 'Helmholtz Free Energy'],
        correctAnswer: 1,
        explanation: 'The Second Law of Thermodynamics states that the total entropy of an isolated system never decreases over time.'
      },
      {
        id: 'scitech-4',
        text: 'Which telescope was launched into space in December 2021 to observe infrared light from the earliest stars and galaxies?',
        options: ['Hubble Space Telescope', 'James Webb Space Telescope', 'Spitzer Space Telescope', 'Chandra X-ray Observatory'],
        correctAnswer: 1,
        explanation: 'The James Webb Space Telescope (JWST) orbits the Sun-Earth L2 Lagrange point with its 6.5-meter gold-coated beryllium mirror.'
      },
      {
        id: 'scitech-5',
        text: 'What property describes a material with zero electrical resistance below a critical threshold temperature?',
        options: ['Ferromagnetism', 'Superconductivity', 'Piezoelectricity', 'Semiconductance'],
        correctAnswer: 1,
        explanation: 'Superconductivity allows electric currents to flow without any loss of energy and produces the Meissner effect (magnetic field expulsion).'
      },
      {
        id: 'scitech-6',
        text: 'What cellular organelles are responsible for adenosine triphosphate (ATP) production via oxidative phosphorylation?',
        options: ['Endoplasmic Reticulum', 'Mitochondria', 'Golgi Apparatus', 'Lysosomes'],
        correctAnswer: 1,
        explanation: 'Mitochondria generate most of the chemical energy needed to power biochemical reactions in eukaryotic cells.'
      },
      {
        id: 'scitech-7',
        text: 'What is the speed of light in a vacuum, rounded to the nearest thousand kilometers per second?',
        options: ['150,000 km/s', '200,000 km/s', '300,000 km/s', '450,000 km/s'],
        correctAnswer: 2,
        explanation: 'The exact speed of light in vacuum is defined as 299,792,458 meters per second, approximately 300,000 km/s.'
      },
      {
        id: 'scitech-8',
        text: 'Which subatomic particle was predicted in 1964 and experimentally confirmed by CERN’s Large Hadron Collider in 2012?',
        options: ['Top Quark', 'Higgs Boson', 'Tau Neutrino', 'Graviton'],
        correctAnswer: 1,
        explanation: 'The Higgs boson is associated with the Higgs field, which gives mass to fundamental particles such as quarks and electrons.'
      },
      {
        id: 'scitech-9',
        text: 'In computer science, what algorithmic complexity class represents decision problems solvable by a deterministic Turing machine in polynomial time?',
        options: ['NP', 'P', 'EXPTIME', 'PSPACE'],
        correctAnswer: 1,
        explanation: 'Class P contains all computational decision problems that can be solved in O(n^k) polynomial time.'
      },
      {
        id: 'scitech-10',
        text: 'What element on the periodic table has the highest electronegativity value on the Pauling scale (3.98)?',
        options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'],
        correctAnswer: 2,
        explanation: 'Fluorine holds the highest electronegativity, pulling shared electron pairs more strongly than any other element.'
      }
    ]
  },

  // 4. World History Challenge
  {
    id: 'world-history-challenge',
    title: 'World History Challenge',
    description: 'Test your grasp of ancient civilizations, medieval conflicts, revolutions, and modern treaties.',
    category: 'History',
    difficulty: 'Medium',
    questionCount: 10,
    estimatedTime: '6 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-08',
    published: true,
    coverImage: '/src/assets/images/quiz_card_history_1790691680571.jpg',
    questions: [
      {
        id: 'hist-1',
        text: 'In what year did the Fall of the Western Roman Empire traditionally occur with the deposition of Romulus Augustulus?',
        options: ['395 AD', '410 AD', '476 AD', '1453 AD'],
        correctAnswer: 2,
        explanation: 'In 476 AD, Germanic chieftain Odoacer deposed Roman Emperor Romulus Augustulus, marking the end of Western Roman rule.'
      },
      {
        id: 'hist-2',
        text: 'Which Magna Carta document, signed in 1215 at Runnymede, first placed statutory limits on the authority of the English monarch?',
        options: ['King Henry II', 'King John', 'King Richard the Lionheart', 'King Edward I'],
        correctAnswer: 1,
        explanation: 'King John was compelled by rebellious feudal barons to sign the Magna Carta Libertatum in June 1215.'
      },
      {
        id: 'hist-3',
        text: 'The historic Silk Road primarily linked the ancient Han Dynasty of China with which great western empire?',
        options: ['Persian Achaemenid Empire', 'Roman Empire', 'Byzantine Empire', 'Ottoman Empire'],
        correctAnswer: 1,
        explanation: 'The overland Silk Road established extensive trade networks between Han China and the Roman Empire, exchanging silk, spices, and glassware.'
      },
      {
        id: 'hist-4',
        text: 'Which female pharaoh of the Eighteenth Dynasty of Egypt is celebrated for expanding trade routes and building the mortuary temple at Deir el-Bahari?',
        options: ['Nefertiti', 'Cleopatra VII', 'Hatshepsut', 'Sobekneferu'],
        correctAnswer: 2,
        explanation: 'Hatshepsut ruled as pharaoh for over two decades around 1478–1458 BC, overseeing unprecedented economic prosperity and ambitious architectural projects.'
      },
      {
        id: 'hist-5',
        text: 'Who commanded the naval fleet of the Allied Greek city-states during the decisive Battle of Salamis in 480 BC?',
        options: ['Leonidas', 'Themistocles', 'Pericles', 'Alcibiades'],
        correctAnswer: 1,
        explanation: 'The Athenian statesman and general Themistocles engineered the naval strategy that routed King Xerxes’ larger Persian fleet.'
      },
      {
        id: 'hist-6',
        text: 'Which European city was divided into four occupation zones following the Potsdam Conference in 1945?',
        options: ['Vienna', 'Berlin', 'Munich', 'Frankfurt'],
        correctAnswer: 1,
        explanation: 'Berlin was partitioned into American, British, French, and Soviet sectors, eventually symbolized by the Berlin Wall.'
      },
      {
        id: 'hist-7',
        text: 'The storming of which medieval fortress on July 14, 1789, ignited the French Revolution?',
        options: ['Conciergerie', 'Tuileries Palace', 'Bastille', 'Château de Vincennes'],
        correctAnswer: 2,
        explanation: 'The storming of the Bastille symbolized the uprising against royal tyranny and is commemorated as French National Day.'
      },
      {
        id: 'hist-8',
        text: 'Which empire was ruled by Suleiman the Magnificent during its golden age of expansion and legal codification in the 16th century?',
        options: ['Safavid Empire', 'Mughal Empire', 'Ottoman Empire', 'Mamluk Sultanate'],
        correctAnswer: 2,
        explanation: 'Suleiman I ruled the Ottoman Empire from 1520 to 1566, overseeing conquests across Southeastern Europe, Western Asia, and North Africa.'
      },
      {
        id: 'hist-9',
        text: 'What pivotal naval battle in October 1805 solidified British naval supremacy against the combined fleets of France and Spain during the Napoleonic Wars?',
        options: ['Battle of the Nile', 'Battle of Copenhagen', 'Battle of Trafalgar', 'Battle of Jutland'],
        correctAnswer: 2,
        explanation: 'Led by Admiral Horatio Nelson, who died in the engagement, the Royal Navy defeated the Franco-Spanish fleet without losing a single ship.'
      },
      {
        id: 'hist-10',
        text: 'The ancient city of Machu Picchu was built by which pre-Columbian civilization in the Andes mountains?',
        options: ['Maya Civilization', 'Aztec Empire', 'Inca Empire', 'Olmec Culture'],
        correctAnswer: 2,
        explanation: 'Constructed around 1450 under Inca emperor Pachacuti, Machu Picchu sits 2,430 meters above sea level in Peru.'
      }
    ]
  },

  // 5. Computer & Internet Quiz
  {
    id: 'computer-and-internet-quiz',
    title: 'Computer & Internet Quiz',
    description: 'Explore the foundations of networks, web standards, programming languages, and operating systems.',
    category: 'Technology',
    difficulty: 'Medium',
    questionCount: 10,
    estimatedTime: '5 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-10',
    published: true,
    coverImage: '/src/assets/images/quiz_card_tech_1790691692003.jpg',
    questions: [
      {
        id: 'comp-1',
        text: 'Who invented the World Wide Web in 1989 while working at CERN in Switzerland?',
        options: ['Vint Cerf', 'Tim Berners-Lee', 'Marc Andreessen', 'Linus Torvalds'],
        correctAnswer: 1,
        explanation: 'Sir Tim Berners-Lee designed HTTP, HTML, URL syntax, and the first web browser/server while working at CERN.'
      },
      {
        id: 'comp-2',
        text: 'What transport layer protocol provides reliable, connection-oriented, ordered byte-stream delivery across IP networks?',
        options: ['UDP', 'ICMP', 'TCP', 'BGP'],
        correctAnswer: 2,
        explanation: 'TCP (Transmission Control Protocol) establishes a three-way handshake (SYN, SYN-ACK, ACK) and verifies packet arrival with checksums and retransmissions.'
      },
      {
        id: 'comp-3',
        text: 'Which programming language was created by Brendan Eich in just 10 days in May 1995 for Netscape Navigator?',
        options: ['Java', 'Python', 'JavaScript', 'PHP'],
        correctAnswer: 2,
        explanation: 'Originally codenamed Mocha and then LiveScript, JavaScript was drafted by Brendan Eich at Netscape to bring interactive scripting to web pages.'
      },
      {
        id: 'comp-4',
        text: 'What does the cryptographic acronym "RSA" stand for, named after its three MIT inventors?',
        options: ['Random Secure Algorithm', 'Rivest, Shamir, and Adleman', 'Recursive Security Architecture', 'Robust Symmetric Authentication'],
        correctAnswer: 1,
        explanation: 'Ron Rivest, Adi Shamir, and Leonard Adleman published the first public-key cryptosystem algorithm in 1977.'
      },
      {
        id: 'comp-5',
        text: 'What open-source operating system kernel was initially created and announced by Linus Torvalds in 1991?',
        options: ['FreeBSD', 'Linux', 'Minix', 'OpenSolaris'],
        correctAnswer: 1,
        explanation: 'Linus Torvalds posted on the comp.os.minix newsgroup in August 1991 announcing his free hobby operating system project.'
      },
      {
        id: 'comp-6',
        text: 'In relational databases, which SQL clause is used to filter records resulting from an aggregate GROUP BY operation?',
        options: ['WHERE', 'ORDER BY', 'HAVING', 'QUALIFY'],
        correctAnswer: 2,
        explanation: 'While WHERE filters individual rows prior to grouping, HAVING filters grouped aggregated results (e.g. HAVING COUNT(*) > 5).'
      },
      {
        id: 'comp-7',
        text: 'What does the standard HTTP status code 429 represent?',
        options: ['Unauthorized', 'Too Many Requests', 'Service Unavailable', 'Payload Too Large'],
        correctAnswer: 1,
        explanation: 'HTTP 429 indicates that the user or client has sent too many requests in a given amount of time (rate limiting).'
      },
      {
        id: 'comp-8',
        text: 'Which data structure adheres strictly to the "First-In, First-Out" (FIFO) principle of ordering?',
        options: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'],
        correctAnswer: 1,
        explanation: 'A Queue processes items in the exact order they arrive: first-in, first-out, contrasting with a LIFO Stack.'
      },
      {
        id: 'comp-9',
        text: 'What default port is assigned by standard internet conventions for unencrypted HTTP traffic?',
        options: ['Port 21', 'Port 22', 'Port 80', 'Port 443'],
        correctAnswer: 2,
        explanation: 'Port 80 is the standard port for HTTP, whereas Port 443 is dedicated to secure TLS/HTTPS connections.'
      },
      {
        id: 'comp-10',
        text: 'What distributed version control system was designed by the Linux kernel community in 2005 to replace BitKeeper?',
        options: ['Subversion', 'Mercurial', 'Git', 'CVS'],
        correctAnswer: 2,
        explanation: 'Git was created by Linus Torvalds in 2005 to manage the rapid, distributed development needs of the Linux kernel.'
      }
    ]
  },

  // 6. Movies & Entertainment Quiz
  {
    id: 'movies-and-entertainment-quiz',
    title: 'Movies & Entertainment Quiz',
    description: 'Test your cinematic recall across Oscar winners, visionary directors, and blockbuster achievements.',
    category: 'Movies',
    difficulty: 'Easy',
    questionCount: 10,
    estimatedTime: '5 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-12',
    published: true,
    coverImage: '/src/assets/images/quiz_card_movies_1790691706566.jpg',
    questions: [
      {
        id: 'mov-1',
        text: 'Which film was the first non-English-language movie in history to win the Academy Award for Best Picture?',
        options: ['Life Is Beautiful (1998)', 'Crouching Tiger, Hidden Dragon (2000)', 'Roma (2018)', 'Parasite (2019)'],
        correctAnswer: 3,
        explanation: 'Bong Joon-ho’s South Korean masterpiece "Parasite" made history at the 92nd Academy Awards by winning both Best International Feature and Best Picture.'
      },
      {
        id: 'mov-2',
        text: 'Who directed the cinematic classics "Jaws", "Schindler’s List", and "Jurassic Park"?',
        options: ['James Cameron', 'Steven Spielberg', 'Martin Scorsese', 'George Lucas'],
        correctAnswer: 1,
        explanation: 'Steven Spielberg has directed some of the most influential and highest-grossing films in cinema history, winning three Academy Awards.'
      },
      {
        id: 'mov-3',
        text: 'Which film won a record-tying 11 Academy Awards in 1998, matching Ben-Hur and later The Lord of the Rings: The Return of the King?',
        options: ['Forrest Gump', 'Titanic', 'Gladiator', 'The English Patient'],
        correctAnswer: 1,
        explanation: 'Directed by James Cameron, Titanic (1997) won 11 Oscars out of 14 nominations, including Best Picture and Best Director.'
      },
      {
        id: 'mov-4',
        text: 'What fictional African kingdom serves as the setting for Marvel Studios’ "Black Panther"?',
        options: ['Zamunda', 'Wakanda', 'Genovia', 'Latveria'],
        correctAnswer: 1,
        explanation: 'Wakanda is the technologically advanced, vibranium-rich hidden nation ruled by King T’Challa in the Marvel Cinematic Universe.'
      },
      {
        id: 'mov-5',
        text: 'Who composed the legendary musical score for "The Good, the Bad and the Ugly", "The Mission", and "Cinema Paradiso"?',
        options: ['John Williams', 'Hans Zimmer', 'Ennio Morricone', 'Bernard Herrmann'],
        correctAnswer: 2,
        explanation: 'Italian maestro Ennio Morricone scored over 400 films, receiving the Academy Honorary Award in 2007 and an Oscar for The Hateful Eight.'
      },
      {
        id: 'mov-6',
        text: 'In the original 1977 "Star Wars: Episode IV - A New Hope", what was Luke Skywalker’s home desert planet called?',
        options: ['Hoth', 'Tatooine', 'Dagobah', 'Alderaan'],
        correctAnswer: 1,
        explanation: 'Tatooine is the arid twin-sun desert world where Luke Skywalker was raised by his Uncle Owen and Aunt Beru.'
      },
      {
        id: 'mov-7',
        text: 'Which actress won consecutive Academy Awards for Best Actress for "The Silence of the Lambs" (1991) and "The Accused" (1988)?',
        options: ['Meryl Streep', 'Jodie Foster', 'Cate Blanchett', 'Glenn Close'],
        correctAnswer: 1,
        explanation: 'Jodie Foster won Best Actress in 1988 for The Accused and again in 1991 for her performance as FBI trainee Clarice Starling.'
      },
      {
        id: 'mov-8',
        text: 'Which animation studio produced the groundbreaking 1995 film "Toy Story", the first entirely computer-animated feature film?',
        options: ['DreamWorks Animation', 'Pixar Animation Studios', 'Studio Ghibli', 'Blue Sky Studios'],
        correctAnswer: 1,
        explanation: 'Directed by John Lasseter, Pixar’s Toy Story marked a revolutionary milestone in computer graphics and feature storytelling.'
      },
      {
        id: 'mov-9',
        text: 'What is the highest-grossing film of all time worldwide (unadjusted for inflation)?',
        options: ['Avengers: Endgame', 'Avatar', 'Star Wars: The Force Awakens', 'Titanic'],
        correctAnswer: 1,
        explanation: 'James Cameron’s 2009 sci-fi epic Avatar holds the all-time box office record with over $2.92 billion grossed globally.'
      },
      {
        id: 'mov-10',
        text: 'Which auteur filmmaker directed "Pulp Fiction", "Kill Bill", and "Inglourious Basterds"?',
        options: ['David Fincher', 'Quentin Tarantino', 'Christopher Nolan', 'Coen Brothers'],
        correctAnswer: 1,
        explanation: 'Quentin Tarantino gained acclaim for his non-linear storytelling, sharp dialogue, and stylized homage to cinema traditions.'
      }
    ]
  },

  // 7. Sports Knowledge Quiz
  {
    id: 'sports-knowledge-quiz',
    title: 'Sports Knowledge Quiz',
    description: 'A global showcase of world records, legendary athletes, football, basketball, and tennis triumphs.',
    category: 'Sports',
    difficulty: 'Medium',
    questionCount: 10,
    estimatedTime: '5 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-14',
    published: true,
    coverImage: '/src/assets/images/quiz_card_sports_1790691718610.jpg',
    questions: [
      {
        id: 'spo-1',
        text: 'Which nation has won the FIFA Men’s World Cup a record five times?',
        options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
        correctAnswer: 2,
        explanation: 'Brazil holds five World Cup titles, winning in 1958, 1962, 1970, 1994, and 2002.'
      },
      {
        id: 'spo-2',
        text: 'Who holds the official world record for the men’s 100-meter sprint at 9.58 seconds, set in Berlin in 2009?',
        options: ['Tyson Gay', 'Asafa Powell', 'Usain Bolt', 'Carl Lewis'],
        correctAnswer: 2,
        explanation: 'Jamaican sprinter Usain Bolt ran 9.58 seconds at the 2009 World Athletics Championships in Berlin, reaching a top speed of 44.72 km/h.'
      },
      {
        id: 'spo-3',
        text: 'In tennis, what constitutes winning a "Career Grand Slam"?',
        options: [
          'Winning all four major titles in a single calendar year',
          'Winning each of the four major championships at least once in a career',
          'Winning Wimbledon four consecutive times',
          'Winning Olympic Gold plus three major tournaments'
        ],
        correctAnswer: 1,
        explanation: 'A Career Grand Slam refers to winning the Australian Open, French Open, Wimbledon, and US Open at least once across an athlete’s playing career.'
      },
      {
        id: 'spo-4',
        text: 'Which NBA player scored an astonishing 100 points in a single game on March 2, 1962?',
        options: ['Michael Jordan', 'Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Kobe Bryant'],
        correctAnswer: 2,
        explanation: 'Playing for the Philadelphia Warriors against the New York Knicks in Hershey, Pennsylvania, Wilt Chamberlain scored 100 points.'
      },
      {
        id: 'spo-5',
        text: 'What is the regulation distance of an official marathon race in kilometers?',
        options: ['40.00 km', '42.195 km', '45.50 km', '48.28 km'],
        correctAnswer: 1,
        explanation: 'The marathon distance was standardized at 42.195 kilometers (26 miles 385 yards) for the 1908 London Olympic Games.'
      },
      {
        id: 'spo-6',
        text: 'Which swimmer has won the most Olympic gold medals (23 gold, 28 total medals) in Olympic history?',
        options: ['Mark Spitz', 'Michael Phelps', 'Ian Thorpe', 'Caeleb Dressel'],
        correctAnswer: 1,
        explanation: 'American swimmer Michael Phelps accumulated 28 total Olympic medals across four Summer Games from Athens 2004 to Rio 2016.'
      },
      {
        id: 'spo-7',
        text: 'In golf, what is the term used when a player completes a hole three strokes under par?',
        options: ['Eagle', 'Albatross (Double Eagle)', 'Birdie', 'Bogey'],
        correctAnswer: 1,
        explanation: 'An albatross (also known as a double eagle) is completing a hole 3 strokes under par, such as a 2 on a par 5.'
      },
      {
        id: 'spo-8',
        text: 'Which country hosted the first official modern Olympic Games in 1896?',
        options: ['France', 'United Kingdom', 'Greece', 'United States'],
        correctAnswer: 2,
        explanation: 'Organized by Pierre de Coubertin, the first modern Olympiad took place at the Panathenaic Stadium in Athens, Greece.'
      },
      {
        id: 'spo-9',
        text: 'In cricket, how many players from the fielding side are on the field of play during a regulation match?',
        options: ['9 players', '10 players', '11 players', '12 players'],
        correctAnswer: 2,
        explanation: 'A fielding team in cricket consists of 11 players on the field, including the bowler and wicket-keeper.'
      },
      {
        id: 'spo-10',
        text: 'Which legendary boxer was known by the monikers "The Louisville Lip" and "The Greatest"?',
        options: ['Joe Frazier', 'George Foreman', 'Muhammad Ali', 'Sugar Ray Robinson'],
        correctAnswer: 2,
        explanation: 'Born Cassius Clay, Muhammad Ali became an iconic three-time world heavyweight champion and global cultural figure.'
      }
    ]
  },

  // 8. Amazing Facts Quiz
  {
    id: 'amazing-facts-quiz',
    title: 'Amazing Facts Quiz',
    description: 'Surprising truths and counter-intuitive facts about biology, astronomy, and our physical universe.',
    category: 'General Knowledge',
    difficulty: 'Easy',
    questionCount: 10,
    estimatedTime: '4 min',
    featured: false,
    popular: true,
    isDaily: false,
    createdAt: '2026-09-16',
    published: true,
    coverImage: '/src/assets/images/quiznova_daily_challenge_1790690740631.jpg',
    questions: [
      {
        id: 'fact-1',
        text: 'How many hearts does an octopus possess to circulate copper-based blue blood through its body?',
        options: ['1 heart', '2 hearts', '3 hearts', '4 hearts'],
        correctAnswer: 2,
        explanation: 'An octopus has three hearts: two branchial hearts pump blood through the gills, while one systemic heart circulates blood to the rest of the body.'
      },
      {
        id: 'fact-2',
        text: 'Honey discovered in ancient Egyptian tombs thousands of years old remains completely edible because of what property?',
        options: ['Artificial preservatives', 'Low moisture and high acidity', 'Zero sugar content', 'Continuous vacuum seal'],
        correctAnswer: 1,
        explanation: 'Honey’s exceptionally low moisture content (around 17%) and acidic pH (3.5–4.5) create an environment where bacteria and microorganisms cannot survive.'
      },
      {
        id: 'fact-3',
        text: 'Which planet in our solar system rotates clockwise on its axis (retrograde rotation), opposite to most planets?',
        options: ['Mars', 'Venus', 'Saturn', 'Neptune'],
        correctAnswer: 1,
        explanation: 'Venus rotates in the opposite direction (retrograde) to nearly all other planets, likely due to a monumental collision early in solar system history.'
      },
      {
        id: 'fact-4',
        text: 'What is the only mammal naturally capable of sustained, powered aerodynamic flight?',
        options: ['Flying Squirrel', 'Sugar Glider', 'Bat', 'Colugo'],
        correctAnswer: 2,
        explanation: 'While flying squirrels glide, bats (order Chiroptera) are the only mammals equipped with true powered wing flight.'
      },
      {
        id: 'fact-5',
        text: 'A day on which solar system planet is actually longer than its entire orbital year around the Sun?',
        options: ['Mercury', 'Venus', 'Jupiter', 'Mars'],
        correctAnswer: 1,
        explanation: 'Venus takes 243 Earth days to complete one rotation on its axis, but only 225 Earth days to complete its orbit around the Sun.'
      },
      {
        id: 'fact-6',
        text: 'Bananas are botanically classified as which of the following botanical categories?',
        options: ['Nuts', 'Drupes', 'Berries', 'Tubers'],
        correctAnswer: 2,
        explanation: 'Botanically, a berry is a fleshy fruit derived from a flower with a single ovary. Bananas, watermelons, and tomatoes are all true berries.'
      },
      {
        id: 'fact-7',
        text: 'Which organ in the human body consumes roughly 20% of the body’s total resting oxygen and energy intake?',
        options: ['Liver', 'Heart', 'Brain', 'Kidneys'],
        correctAnswer: 2,
        explanation: 'Despite representing only about 2% of total human body weight, the brain consumes about 20% of glucose and oxygen at rest.'
      },
      {
        id: 'fact-8',
        text: 'Sharks existed on Earth before which of the following ancient life forms appeared?',
        options: ['Trees', 'Insects', 'Jellyfish', 'Corals'],
        correctAnswer: 0,
        explanation: 'The earliest fossil evidence of sharks dates back over 400–450 million years, predating the earliest terrestrial trees by tens of millions of years.'
      },
      {
        id: 'fact-9',
        text: 'What remarkable physiological trait distinguishes the platypus and the echidna from all other living mammals?',
        options: ['They are cold-blooded', 'They lay eggs (monotremes)', 'They have feathers', 'They lack nervous systems'],
        correctAnswer: 1,
        explanation: 'Platypuses and echidnas are monotremes: mammals that lay eggs instead of giving birth to live young, yet lactate to nourish their offspring.'
      },
      {
        id: 'fact-10',
        text: 'What is the loudest animal on Earth relative to distance, capable of producing clicks exceeding 230 decibels underwater?',
        options: ['Blue Whale', 'Sperm Whale', 'Howler Monkey', 'Pistol Shrimp'],
        correctAnswer: 1,
        explanation: 'The echolocation clicks of the sperm whale can reach 230–236 decibels underwater, loud enough to stun giant squids.'
      }
    ]
  },

  // 9. Brain Challenge (Daily Quiz Candidate)
  {
    id: 'brain-challenge',
    title: 'Brain Challenge',
    description: 'Sharpen your deductive reasoning, numerical logic, word patterns, and spatial puzzles.',
    category: 'Science',
    difficulty: 'Hard',
    questionCount: 10,
    estimatedTime: '8 min',
    featured: true,
    popular: true,
    isDaily: true,
    badge: "Today's Daily Pick",
    createdAt: '2026-09-18',
    published: true,
    coverImage: '/src/assets/images/quiznova_daily_challenge_1790690740631.jpg',
    questions: [
      {
        id: 'bc-1',
        text: 'What number logically completes the sequence: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '46'],
        correctAnswer: 2,
        explanation: 'The difference increases by 2 each step: +4, +6, +8, +10, +12. Thus 30 + 12 = 42 (also n*(n+1) for n=1,2,3,4,5,6).'
      },
      {
        id: 'bc-2',
        text: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
        options: ['$0.10', '$0.05', '$0.15', '$0.01'],
        correctAnswer: 1,
        explanation: 'Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 => 2x = 0.10 => x = $0.05. The bat costs $1.05.'
      },
      {
        id: 'bc-3',
        text: 'If 5 machines take 5 minutes to make 5 widgets, how many minutes will 100 machines take to make 100 widgets?',
        options: ['100 minutes', '50 minutes', '20 minutes', '5 minutes'],
        correctAnswer: 3,
        explanation: 'Each individual machine takes 5 minutes to produce 1 widget. With 100 machines running simultaneously, they produce 100 widgets in the same 5 minutes.'
      },
      {
        id: 'bc-4',
        text: 'Which word does NOT belong with the others: Triangle, Square, Pentagon, Cylinder?',
        options: ['Triangle', 'Square', 'Pentagon', 'Cylinder'],
        correctAnswer: 3,
        explanation: 'Triangle, Square, and Pentagon are two-dimensional planar polygons, whereas a Cylinder is a three-dimensional curved geometric solid.'
      },
      {
        id: 'bc-5',
        text: 'If all Zips are Zaps, and some Zaps are Zops, which of the following MUST logically be true?',
        options: [
          'All Zips are Zops',
          'Some Zips are Zops',
          'At least one Zap is both a Zip and a Zop',
          'None of the above are guaranteed to be true'
        ],
        correctAnswer: 3,
        explanation: 'Because only "some" Zaps are Zops, the subset of Zaps that are Zips might not overlap with the Zops at all.'
      },
      {
        id: 'bc-6',
        text: 'What is the sum of all interior angles in a regular hexagon?',
        options: ['360 degrees', '540 degrees', '720 degrees', '900 degrees'],
        correctAnswer: 2,
        explanation: 'The formula for sum of interior angles of an n-sided polygon is (n - 2) * 180°. For n=6: (6 - 2) * 180° = 4 * 180° = 720°.'
      },
      {
        id: 'bc-7',
        text: 'Mary’s father has 5 daughters: Nana, Nene, Nini, Nono. What is the name of the fifth daughter?',
        options: ['Nunu', 'Mary', 'Nina', 'None of these'],
        correctAnswer: 1,
        explanation: 'The riddle states at the very beginning: "Mary’s father has 5 daughters". Thus, Mary is the fifth daughter!'
      },
      {
        id: 'bc-8',
        text: 'What is the next prime number immediately following 31?',
        options: ['33', '35', '37', '39'],
        correctAnswer: 2,
        explanation: '33 is divisible by 3, 35 by 5, and 39 by 3. 37 has no divisors other than 1 and itself, making it prime.'
      },
      {
        id: 'bc-9',
        text: 'If yesterday was two days before Sunday, what day will tomorrow be?',
        options: ['Sunday', 'Monday', 'Saturday', 'Tuesday'],
        correctAnswer: 0,
        explanation: 'Two days before Sunday is Friday (yesterday = Friday). That means today is Saturday, and tomorrow will be Sunday.'
      },
      {
        id: 'bc-10',
        text: 'A clock shows 3:15. What is the acute angle between the hour hand and the minute hand?',
        options: ['0 degrees', '7.5 degrees', '12 degrees', '15 degrees'],
        correctAnswer: 1,
        explanation: 'At 3:15, the minute hand is at 90°. The hour hand has moved 1/4 of the way between 3 and 4 (30° / 4 = 7.5°). The angle between them is exactly 7.5°.'
      }
    ]
  },

  // 10. Personality Quiz
  {
    id: 'personality-quiz',
    title: 'Personality & Thinking Style Quiz',
    description: 'Discover your cognitive orientation: Strategic Visionary, Empathetic Connector, Analytical Architect, or Action Catalyst.',
    category: 'Personality',
    difficulty: 'Easy',
    questionCount: 10,
    estimatedTime: '5 min',
    featured: true,
    popular: true,
    isDaily: false,
    isPersonality: true,
    createdAt: '2026-09-20',
    published: true,
    coverImage: '/src/assets/images/quiz_card_thinker_1790691653000.jpg',
    questions: [
      {
        id: 'pers-1',
        text: 'When faced with an unexpected complex problem, what is your immediate first reflex?',
        options: [
          'Deconstruct it into core data, variables, and logical components',
          'Brainstorm the grand possibilities and big-picture potential',
          'Check in with how it impacts teammates and stakeholders',
          'Jump directly into testing a rapid, hands-on solution'
        ],
        correctAnswer: 0,
        explanation: 'Option A reflects an Analytical style, B reflects a Visionary style, C reflects an Empathetic style, and D reflects an Action Catalyst style.'
      },
      {
        id: 'pers-2',
        text: 'What kind of work environment sparks your greatest productivity and flow state?',
        options: [
          'Structured, quiet workspaces with organized metrics and clear documentation',
          'Dynamic spaces with whiteboards, open horizons, and creative freedom',
          'Collaborative circles where ideas are shared through genuine conversation',
          'Fast-paced agile environments with tangible daily milestones and sprints'
        ],
        correctAnswer: 1,
        explanation: 'Your preferred environment reveals whether you lean toward deep systematic focus, visionary ideation, team resonance, or iterative execution.'
      },
      {
        id: 'pers-3',
        text: 'How do you typically evaluate success at the conclusion of a significant project?',
        options: [
          'By the quantitative precision, durability, and error-free architecture',
          'By the novelty and groundbreaking innovation achieved',
          'By how much the team grew, bonded, and felt fulfilled',
          'By how quickly and effectively the outcome was delivered'
        ],
        correctAnswer: 0,
        explanation: 'Analytical minds measure precision; Visionaries look for novelty; Connectors value team cohesion; Catalysts celebrate speed and delivery.'
      },
      {
        id: 'pers-4',
        text: 'When reading a book or article, what resonates most deeply with you?',
        options: [
          'Rigorous evidence, charts, experimental data, and logic',
          'Unconventional philosophies and sweeping historical forecasts',
          'Intimate human narratives, motives, and character psychology',
          'Actionable frameworks, practical blueprints, and tactics'
        ],
        correctAnswer: 1,
        explanation: 'Information consumption reveals your cognitive appetite—from empirical truth to macro synthesis or human emotion.'
      },
      {
        id: 'pers-5',
        text: 'In group conversations or meetings, which role feels most natural to you?',
        options: [
          'The objective analyst verifying assumptions and highlighting edge cases',
          'The conceptual spark proposing bold new directions',
          'The mediator ensuring all voices are heard and synthesized harmoniously',
          'The driver steering conversation toward tangible next steps and owners'
        ],
        correctAnswer: 3,
        explanation: 'Your conversational anchor indicates your functional contribution to collaborative problem-solving.'
      },
      {
        id: 'pers-6',
        text: 'What energizes you most during your leisure or weekend time?',
        options: [
          'Mastering a challenging technical craft, puzzle, or strategic game',
          'Exploring new ideas, dreaming up creative concepts, or visiting exhibits',
          'Deep, meaningful conversations with close friends and family',
          'Engaging in sports, physical adventures, or building hands-on projects'
        ],
        correctAnswer: 0,
        explanation: 'Leisure preferences illuminate the intrinsic motivations that recharge your mental energy.'
      },
      {
        id: 'pers-7',
        text: 'How do you respond when a planned strategy suddenly fails due to changing circumstances?',
        options: [
          'Conduct a root-cause autopsy to isolate the failure point',
          'View it as a clean slate to reinvent the entire paradigm',
          'Reassure everyone involved and keep morale resilient and calm',
          'Immediately pivot to Plan B without dwelling on the setback'
        ],
        correctAnswer: 3,
        explanation: 'Crisis adaptation shows your cognitive resilience—whether through methodical triage, pivot, empathy, or immediate motion.'
      },
      {
        id: 'pers-8',
        text: 'What do people frequently seek your advice or guidance for?',
        options: [
          'Objective problem diagnosis and structured analysis',
          'Inspiration, vision, and out-of-the-box conceptual thinking',
          'Conflict resolution, emotional counsel, and interpersonal wisdom',
          'Getting things organized and driving execution across the finish line'
        ],
        correctAnswer: 0,
        explanation: 'External perceptions highlight the superpowers that others recognize in your decisions.'
      },
      {
        id: 'pers-9',
        text: 'Which phrase best captures your personal motto or guiding philosophy?',
        options: [
          '"Trust in verified evidence and systematic rigor."',
          '"The future belongs to those who imagine the unimagined."',
          '"True strength lies in empathy and mutual understanding."',
          '"Done is better than perfect; momentum creates clarity."'
        ],
        correctAnswer: 1,
        explanation: 'Philosophical anchors reflect your core cognitive driver.'
      },
      {
        id: 'pers-10',
        text: 'When learning a completely new discipline or hobby, how do you start?',
        options: [
          'Study the foundational principles, documentation, and textbooks first',
          'Envision the peak creations and creative boundaries of the field',
          'Find a mentor or join a vibrant learning community',
          'Jump directly into hands-on trial-and-error experimentation'
        ],
        correctAnswer: 0,
        explanation: 'Your learning trajectory mirrors your mental framework for acquiring mastery.'
      }
    ]
  }
];
