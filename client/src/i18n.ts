import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    // Navigation
                    home: 'Home',
                    about: 'About',
                    portfolio: 'Portfolio',
                    contact: 'Contact',
                    login: 'Login',
                    logout: 'Logout',

                    // Footer
                    footerText: 'Fashion Designer Portfolio',

                    // Home page
                    welcome: 'Welcome to My Fashion Design Portfolio',
                    homeDescription: 'I am a passionate fashion designer specializing in sustainable and innovative clothing. My designs blend creativity with eco-consciousness, creating unique pieces that make a statement while respecting our planet.',

                    // About page
                    aboutMe: 'About Me',
                    aboutDescription: 'With years of experience in the fashion industry, I\'ve developed a unique approach to design that combines traditional techniques with modern, sustainable practices.',
                    designApproach: 'My design philosophy is simple: there are no impossible things in fashion. I specialize in creating pieces from recycled materials, giving new life to discarded fabrics and accessories.',

                    // Portfolio page
                    addProject: 'Add New Project',
                    projectName: 'Name',
                    projectDescription: 'Description',
                    projectPrice: 'Price',
                    projectImages: 'Images',
                    editProject: 'Edit Project',
                    save: 'Save',
                    currentImages: 'Current Images',
                    addNewImages: 'Add New Images',
                    markedForDeletion: 'Marked for deletion',
                    imagePreviews: 'Image Previews',
                    newImagePreviews: 'New Image Previews',

                    // Contact form
                    name: 'Name',
                    email: 'Email',
                    message: 'Message',
                    send: 'Send',

                    // Login form
                    username: 'Username',
                    password: 'Password',
                    register: 'Register',
                    alreadyHaveAccount: 'Already have an account? Login',
                    dontHaveAccount: 'Don\'t have an account? Register',

                    // User panel
                    userPanel: 'User Panel',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    address: 'Address',
                    phone: 'Phone',
                    shippingAddress: 'Shipping Address',
                    saveUserDetails: 'Save User Details',
                    userDetailsSaved: 'User details saved successfully',
                    errorSavingUserDetails: 'Error saving user details',

                    // Admin panel
                    adminPanel: 'Admin Panel',
                    registeredUsers: 'Registered Users',

                    // Cart
                    cart: 'Cart',
                    cartEmpty: 'Your cart is empty',
                    remove: 'Remove',
                    total: 'Total',
                    clearCart: 'Clear Cart',
                    addToCart: 'Add to Cart',
                    price: 'Price',
                    openCart: 'Open Cart',
                },
            },
            pl: {
                translation: {
                    // Navigation
                    home: 'Strona główna',
                    about: 'O mnie',
                    portfolio: 'Portfolio',
                    contact: 'Kontakt',
                    login: 'Logowanie',
                    logout: 'Wyloguj',

                    // Footer
                    footerText: 'Portfolio Projektanta Mody',

                    // Home page
                    welcome: 'Witaj w Moim Portfolio Projektanta Mody',
                    homeDescription: 'Jestem pasjonatem projektowania mody, specjalizującym się w zrównoważonej i innowacyjnej odzieży. Moje projekty łączą kreatywność z ekologiczną świadomością, tworząc unikalne elementy, które robią wrażenie, szanując jednocześnie naszą planetę.',

                    // About page
                    aboutMe: 'O Mnie',
                    aboutDescription: 'Z wieloletnim doświadczeniem w branży modowej, wypracowałam unikalne podejście do projektowania, które łączy tradycyjne techniki z nowoczesnymi, zrównoważonymi praktykami.',
                    designApproach: 'Moja filozofia projektowania jest prosta: w modzie nie ma rzeczy niemożliwych. Specjalizuję się w tworzeniu elementów z materiałów z odzysku, nadając nowe życie odrzuconym tkaninom i akcesoriom.',

                    // Portfolio page
                    addProject: 'Dodaj Nowy Projekt',
                    projectName: 'Nazwa',
                    projectDescription: 'Opis',
                    projectPrice: 'Cena',
                    projectImages: 'Zdjęcia',
                    editProject: 'Edytuj Projekt',
                    save: 'Zapisz',
                    currentImages: 'Obecne Zdjęcia',
                    addNewImages: 'Dodaj Nowe Zdjęcia',
                    markedForDeletion: 'Zaznaczone do usunięcia',
                    imagePreviews: 'Podgląd Zdjęć',
                    newImagePreviews: 'Podgląd Nowych Zdjęć',

                    // Contact form
                    name: 'Imię',
                    email: 'Email',
                    message: 'Wiadomość',
                    send: 'Wyślij',

                    // Login form
                    username: 'Nazwa użytkownika',
                    password: 'Hasło',
                    register: 'Zarejestruj',
                    alreadyHaveAccount: 'Masz już konto? Zaloguj się',
                    dontHaveAccount: 'Nie masz konta? Zarejestruj się',

                    // User panel
                    userPanel: 'Panel Użytkownika',
                    firstName: 'Imię',
                    lastName: 'Nazwisko',
                    address: 'Adres',
                    phone: 'Telefon',
                    shippingAddress: 'Adres Wysyłki',
                    saveUserDetails: 'Zapisz Dane Użytkownika',
                    userDetailsSaved: 'Dane użytkownika zostały pomyślnie zapisane',
                    errorSavingUserDetails: 'Błąd podczas zapisywania danych użytkownika',

                    // Admin panel
                    adminPanel: 'Panel Administratora',
                    registeredUsers: 'Zarejestrowani Użytkownicy',

                    // Cart
                    cart: 'Koszyk',
                    cartEmpty: 'Twój koszyk jest pusty',
                    remove: 'Usuń',
                    total: 'Suma',
                    clearCart: 'Wyczyść koszyk',
                    addToCart: 'Dodaj do koszyka',
                    price: 'Cena',
                    openCart: 'Otwórz Koszyk',
                },
            },
        },
        lng: 'pl',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;