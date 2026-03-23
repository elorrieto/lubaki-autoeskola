import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "eu" | "es";

export interface Translations {
  // Login
  loginTitle: string;
  username: string;
  password: string;
  enter: string;
  entering: string;
  createAccount: string;
  website: string;
  instagram: string;
  tagline: string;
  errorUsername: string;
  // Register
  registerTitle: string;
  registerSubtitle: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  cuentaBancaria: string;
  usuario: string;
  contrasena: string;
  completing: string;
  required: string;
  // Home
  welcome: string;
  nextClass: string;
  practicalHours: string;
  testsCompleted: string;
  progress: string;
  motto: string;
  mainMenu: string;
  schedules: string;
  scheduleSub: string;
  enrollment: string;
  enrollmentSub: string;
  contact: string;
  contactSub: string;
  profile: string;
  profileSub: string;
  logout: string;
  // Calendar
  calendarTitle: string;
  availableSlots: string;
  booked: string;
  available: string;
  occupied: string;
  yourClass: string;
  calendarInfo: string;
  // Courses
  coursesTitle: string;
  coursesSubtitle: string;
  requestInfo: string;
  from: string;
  hours: string;
  mostPopular: string;
  // Contact
  contactTitle: string;
  contactHero: string;
  contactSchedule: string;
  call: string;
  sendEmail: string;
  viewProfile: string;
  openWeb: string;
  faqTitle: string;
  faq1q: string;
  faq1a: string;
  faq2q: string;
  faq2a: string;
  faq3q: string;
  faq3a: string;
  faq4q: string;
  faq4a: string;
  // Profile
  profileTitle: string;
  activeStudent: string;
  courseProgress: string;
  personalData: string;
  healthTracking: string;
  wellbeing: string;
  healthInfo: string;
  weightLabel: string;
  fatLabel: string;
  sleepLabel: string;
  saveData: string;
  saved: string;
  // Admin
  adminTitle: string;
  statsTab: string;
  studentsTab: string;
  teachersTab: string;
  generalSummary: string;
  totalStudents: string;
  activeStudents: string;
  approvedStudents: string;
  droppedStudents: string;
  firstTimeRate: string;
  outOf: string;
  approvedStudentsOf: string;
  aboveNational: string;
  belowNational: string;
  satisfactionIndex: string;
  avgOf: string;
  studentsByPermit: string;
  performanceByTeacher: string;
  students: string;
  firstTime: string;
  avgRating: string;
  registeredStudents: string;
  active: string;
  approved: string;
  dropped: string;
  practiceHours: string;
  tests: string;
  firstTimeBadge: string;
  teachers: string;
  specialty: string;
  hoursGiven: string;
  firstTimeApproved: string;
  satisfaction: string;
}

const EU: Translations = {
  // Login
  loginTitle: "Hasi saioa",
  username: "Erabiltzailea",
  password: "Pasahitza",
  enter: "Sartu",
  entering: "Sartzen...",
  createAccount: "Kontua sortu",
  website: "Webgunea",
  instagram: "Instagram",
  tagline: "Gidatzaile-belaunaldi berria",
  errorUsername: "Sartu zure erabiltzailea",
  // Register
  registerTitle: "Kontua sortu",
  registerSubtitle: "Bete zure datuak Lubaki Autoeskolan matrikulatzeko",
  nombre: "Izena",
  apellidos: "Abizenak",
  dni: "NAN / NIE",
  telefono: "Telefonoa",
  direccion: "Helbidea",
  cuentaBancaria: "Banku-kontua",
  usuario: "Erabiltzailea",
  contrasena: "Pasahitza",
  completing: "Erregistratzen...",
  required: "Beharrezkoa",
  // Home
  welcome: "Ongi etorri",
  nextClass: "Hurrengo klasea: Astelehena 10:00",
  practicalHours: "Praktika-orduak",
  testsCompleted: "Gainditutako testak",
  progress: "Aurrerapena",
  motto: "Ez dugu borroka galdutzat ematen. Zurekin gaude baimena lortu arte.",
  mainMenu: "Menu nagusia",
  schedules: "Ordutegiak",
  scheduleSub: "Zure klaseak eta erabilgarritasuna ikusi",
  enrollment: "Matrikulazioa",
  enrollmentSub: "Baimenak eta erabilgarri dauden ikastaroak",
  contact: "Kontaktua",
  contactSub: "Gurekin zuzenean hitz egin",
  profile: "Nire profila",
  profileSub: "Zure datuak eta osasuna",
  logout: "Saioa itxi",
  // Calendar
  calendarTitle: "Ordutegiak",
  availableSlots: "Erabilgarri dauden tarteak",
  booked: "Erreserbatua",
  available: "Erabilgarri",
  occupied: "Beteta",
  yourClass: "Zure klasea",
  calendarInfo: "Klase bat erreserbatzeko edo aldatzeko, jarri harremanetan autoeskolarekin.",
  // Courses
  coursesTitle: "Matrikulazioa",
  coursesSubtitle: "Hautatu matrikulatu nahi duzun baimena edo ikastaroa. Prozesua osatzeko harremanetan jarriko gara.",
  requestInfo: "Informazioa eskatu",
  from: "Hemendik",
  hours: "praktika-orduak",
  mostPopular: "Ezagunena",
  // Contact
  contactTitle: "Kontaktua",
  contactHero: "Laguntza behar al duzu?",
  contactSchedule: "Astelehenetik ostiralera eskuragarri, 9:00etatik 20:00etara",
  call: "Deitu",
  sendEmail: "Emaila bidali",
  viewProfile: "Profila ikusi",
  openWeb: "Webgunea ireki",
  faqTitle: "Ohiko galderak",
  faq1q: "Noiz hasten dira klaseak?",
  faq1a: "Edozein momentutan has zaitezke. Klaseak zure ordutegira egokitzen dira.",
  faq2q: "Zenbat irauten du prozesuak?",
  faq2a: "Ikasleak kudeatzeko moduan aldatzen da. Batez bestekoa 3-6 hilabete da teoria eta praktikak uztartuz.",
  faq3q: "Finantzaketa eskaintzen al duzue?",
  faq3a: "Bai, ordainketa plan egokituak ditugu. Kontsultatu gurekin konpromiso gabe.",
  faq4q: "Non zaude?",
  faq4a: "Harremanetan jarri eta helbidea eta bilgunea adieraziko dizugu.",
  // Profile
  profileTitle: "Nire profila",
  activeStudent: "Ikasle aktiboa",
  courseProgress: "Ikastaroaren aurrerapena",
  personalData: "Datu pertsonalak",
  healthTracking: "Osasun-jarraiketa",
  wellbeing: "Ongizatea",
  healthInfo: "Erregistratu zure datuak ikasketa prozesuan zehar jarraipen integrala egiteko.",
  weightLabel: "Pisua",
  fatLabel: "Gorputz-koipea",
  sleepLabel: "Lo-orduak",
  saveData: "Datuak gorde",
  saved: "Gordeta",
  // Admin
  adminTitle: "Administratzaile-panela",
  statsTab: "Estatistikak",
  studentsTab: "Ikasleak",
  teachersTab: "Irakasleak",
  generalSummary: "Laburpen orokorra",
  totalStudents: "Ikasle guztiak",
  activeStudents: "Aktiboak",
  approvedStudents: "Gainditutakoak",
  droppedStudents: "Bajak",
  firstTimeRate: "Lehen aldian gainditutakoak",
  outOf: "tik",
  approvedStudentsOf: "ikasle gaindituetatik",
  aboveNational: "✓ Nazio-batezbestekoaren gainetik (%55)",
  belowNational: "Nazio-batezbestekoaren azpitik (%55)",
  satisfactionIndex: "Satisfakzio-indizea",
  avgOf: "Batezbestekoa",
  studentsByPermit: "Ikasleak baimenaren arabera",
  performanceByTeacher: "Irakaslearen errendimendua",
  students: "ikasle",
  firstTime: "1. aldiz",
  avgRating: "★ Batezb.",
  registeredStudents: "ikasle erregistratuta",
  active: "Aktiboa",
  approved: "Gaindituta",
  dropped: "Baja",
  practiceHours: "praktika-orduak",
  tests: "testak",
  firstTimeBadge: "Lehen aldian gainditu zuen",
  teachers: "irakasle",
  specialty: "Espezialitatea",
  hoursGiven: "emandako orduak",
  firstTimeApproved: "Lehen aldian gainditutakoak",
  satisfaction: "Satisfakzioa",
};

const ES: Translations = {
  // Login
  loginTitle: "Iniciar sesión",
  username: "Usuario",
  password: "Contraseña",
  enter: "Entrar",
  entering: "Entrando...",
  createAccount: "Crear cuenta",
  website: "Sitio web",
  instagram: "Instagram",
  tagline: "Nueva generación de conductores",
  errorUsername: "Introduce tu usuario",
  // Register
  registerTitle: "Crear cuenta",
  registerSubtitle: "Rellena tus datos para matricularte en Lubaki Autoeskola",
  nombre: "Nombre",
  apellidos: "Apellidos",
  dni: "DNI / NIE",
  telefono: "Teléfono",
  direccion: "Dirección",
  cuentaBancaria: "Cuenta bancaria",
  usuario: "Usuario",
  contrasena: "Contraseña",
  completing: "Registrando...",
  required: "Requerido",
  // Home
  welcome: "Bienvenido",
  nextClass: "Próxima clase: Lunes 10:00",
  practicalHours: "Horas prácticas",
  testsCompleted: "Tests superados",
  progress: "Progreso",
  motto: "No damos la batalla por perdida. Estamos aquí para acompañarte hasta que consigas tu carnet.",
  mainMenu: "Menú principal",
  schedules: "Horarios",
  scheduleSub: "Ver tus clases y disponibilidad",
  enrollment: "Matriculación",
  enrollmentSub: "Permisos y cursos disponibles",
  contact: "Contacto",
  contactSub: "Habla con nosotros directamente",
  profile: "Mi perfil",
  profileSub: "Tus datos y salud",
  logout: "Cerrar sesión",
  // Calendar
  calendarTitle: "Horarios",
  availableSlots: "Franjas disponibles",
  booked: "Reservada",
  available: "Disponible",
  occupied: "Ocupada",
  yourClass: "Tu clase",
  calendarInfo: "Para reservar o modificar una clase, contacta directamente con la autoescuela.",
  // Courses
  coursesTitle: "Matriculación",
  coursesSubtitle: "Selecciona el permiso o curso en el que deseas matricularte. Nos pondremos en contacto contigo para finalizar el proceso.",
  requestInfo: "Solicitar información",
  from: "Desde",
  hours: "h. prácticas",
  mostPopular: "Más popular",
  // Contact
  contactTitle: "Contacto",
  contactHero: "¿Necesitas ayuda?",
  contactSchedule: "Disponibles de lunes a viernes de 9:00 a 20:00",
  call: "Llamar",
  sendEmail: "Enviar email",
  viewProfile: "Ver perfil",
  openWeb: "Abrir web",
  faqTitle: "Preguntas frecuentes",
  faq1q: "¿Cuándo empiezan las clases?",
  faq1a: "Puedes empezar en cualquier momento. Las clases se adaptan a tu horario.",
  faq2q: "¿Cuánto dura el proceso?",
  faq2a: "Depende del alumno. La media es 3-6 meses combinando teoría y prácticas.",
  faq3q: "¿Ofrecéis financiación?",
  faq3a: "Sí, disponemos de planes de pago adaptados. Consúltanos sin compromiso.",
  faq4q: "¿Dónde están ubicados?",
  faq4a: "Contacta con nosotros y te indicaremos la dirección y punto de recogida.",
  // Profile
  profileTitle: "Mi perfil",
  activeStudent: "Alumno activo",
  courseProgress: "Progreso del curso",
  personalData: "Datos personales",
  healthTracking: "Seguimiento de salud",
  wellbeing: "Bienestar",
  healthInfo: "Registra tus datos para un seguimiento integral durante el proceso de aprendizaje.",
  weightLabel: "Peso",
  fatLabel: "Grasa corporal",
  sleepLabel: "Horas de sueño",
  saveData: "Guardar datos",
  saved: "Guardado",
  // Admin
  adminTitle: "Panel Administrador",
  statsTab: "Estadísticas",
  studentsTab: "Alumnos",
  teachersTab: "Profesores",
  generalSummary: "Resumen general",
  totalStudents: "Total alumnos",
  activeStudents: "Activos",
  approvedStudents: "Aprobados",
  droppedStudents: "Bajas",
  firstTimeRate: "Aprobados a la primera",
  outOf: "de",
  approvedStudentsOf: "alumnos aprobados",
  aboveNational: "✓ Por encima de la media nacional (55%)",
  belowNational: "Por debajo de la media nacional (55%)",
  satisfactionIndex: "Índice de satisfacción",
  avgOf: "Media de",
  studentsByPermit: "Alumnos por permiso",
  performanceByTeacher: "Rendimiento por profesor",
  students: "alumnos",
  firstTime: "1ª vez",
  avgRating: "★ Media",
  registeredStudents: "alumnos registrados",
  active: "Activo",
  approved: "Aprobado",
  dropped: "Baja",
  practiceHours: "Horas prácticas",
  tests: "tests",
  firstTimeBadge: "Aprobó a la primera",
  teachers: "profesores",
  specialty: "Especialidad",
  hoursGiven: "horas impartidas",
  firstTimeApproved: "Aprobados a la primera",
  satisfaction: "Satisfacción",
};

const TRANSLATIONS: Record<Lang, Translations> = { eu: EU, es: ES };

const LANG_KEY = "@lubaki_lang";

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("eu");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((val) => {
      if (val === "eu" || val === "es") setLangState(val);
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
