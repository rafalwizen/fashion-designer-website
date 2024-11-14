import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    home: 'Home',
                    about: 'About',
                    portfolio: 'Portfolio',
                    contact: 'Contact',
                    login: 'Login',
                    logout: 'Logout',
                    footerText: 'Fashion Designer Portfolio',
                    welcome: 'Welcome to My Fashion Design Portfolio',
                    homeDescription: 'I am a passionate fashion designer specializing in sustainable and innovative clothing. My designs blend creativity with eco-consciousness, creating unique pieces that make a statement while respecting our planet.',
                    aboutMe: 'About Me',
                    aboutDescription: 'With years of experience in the fashion industry, I\'ve developed a unique approach to design that combines traditional techniques with modern, sustainable practices.',
                    designApproach: 'My design philosophy is simple: there are no impossible things in fashion. I specialize in creating pieces from recycled materials, giving new life to discarded fabrics and accessories.',
                    addProject: 'Add New Project',
                    name: 'Name',
                    email: 'Email',
                    message: 'Message',
                    send: 'Send',
                    username: 'Username',
                    password: 'Password',
                    register: 'Register',
                    alreadyHaveAccount: 'Already have an account? Login',
                    dontHaveAccount: 'Don\'t have an account? Register',
                },
            },
            pl: {
                translation: {
                    home: 'Strona główna',
                    about: 'O mnie',
                    portfolio: 'Portfolio',
                    contact: 'Kontakt',
                    login: 'Logowanie',
                    logout: 'Wyloguj',
                    footerText: 'Portfolio Projektanta Mody',
                    welcome: 'Witaj w Moim Portfolio Projektanta Mody',
                    homeDescription: 'Jestem pasjonatem projektowania mody, specjalizującym się w zrównoważonej i innowacyjnej odzieży. Moje projekty łączą kreatywność z ekologiczną świadomością, tworząc unikalne elementy, które robią wrażenie, szanując jednocześnie naszą planetę.',
                    aboutMe: 'O Mnie',
                    aboutDescription: 'Z wieloletnim doświadczeniem w branży modowej, wypracowałam unikalne podejście do projektowania, które łączy tradycyjne techniki z nowoczesnymi, zrównoważonymi praktykami.',
                    designApproach: 'Moja filozofia projektowania jest prosta: w modzie nie ma rzeczy niemożliwych. Specjalizuję się w tworzeniu elementów z materiałów z odzysku, nadając nowe życie odrzuconym tkaninom i akcesoriom.',
                    addProject: 'Dodaj Nowy Projekt',
                    name: 'Imię',
                    email: 'Email',
                    message: 'Wiadomość',
                    send: 'Wyślij',
                    username: 'Nazwa użytkownika',
                    password: 'Hasło',
                    register: 'Zarejestruj',
                    alreadyHaveAccount: 'Masz już konto? Zaloguj się',
                    dontHaveAccount: 'Nie masz konta? Zarejestruj się',
                },
            },
        },
        lng: 'pl', // Domyślny język
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;