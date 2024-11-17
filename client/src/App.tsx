import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Login from './components/Login';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Router>
            <div className="bg-light-lavender min-h-screen flex flex-col">
                <nav className="bg-dark-navy text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex space-x-4">
                            <Link to="/" className="hover:text-powder-pink">{t('home')}</Link>
                            <Link to="/about" className="hover:text-powder-pink">{t('about')}</Link>
                            <Link to="/portfolio" className="hover:text-powder-pink">{t('portfolio')}</Link>
                            <Link to="/contact" className="hover:text-powder-pink">{t('contact')}</Link>
                            {isLoggedIn && !isAdmin ? (
                                <Link to="/user-panel" className="hover:text-powder-pink">{t('userPanel')}</Link>
                            ) : null}
                            {isLoggedIn && isAdmin ? (
                                <Link to="/admin-panel" className="hover:text-powder-pink">{t('adminPanel')}</Link>
                            ) : null}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => changeLanguage('pl')}
                                className="bg-powder-pink text-dark-navy px-2 py-1 rounded"
                            >
                                PL
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className="bg-powder-pink text-dark-navy px-2 py-1 rounded"
                            >
                                EN
                            </button>
                            {!isLoggedIn ? (
                                <Link to="/login" className="hover:text-powder-pink">{t('login')}</Link>
                            ) : (
                                <button onClick={() => setIsLoggedIn(false)} className="hover:text-powder-pink">
                                    {t('logout')}
                                </button>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto mt-8 flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/portfolio" element={<Portfolio isAdmin={isAdmin} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                            path="/login"
                            element={
                                <Login
                                    setIsLoggedIn={setIsLoggedIn}
                                    setIsAdmin={setIsAdmin}
                                />
                            }
                        />
                        <Route
                            path="/user-panel"
                            element={
                                isLoggedIn && !isAdmin ? (
                                    <UserPanel />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                        <Route
                            path="/admin-panel"
                            element={
                                isLoggedIn && isAdmin ? (
                                    <AdminPanel />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                    </Routes>
                </div>

                <footer className="bg-dark-navy text-white p-4 mt-8">
                    <div className="container mx-auto flex justify-between items-center">
                        <p>&copy; 2023 {t('footerText')}</p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-powder-pink">Facebook</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-powder-pink">Instagram</a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-powder-pink">YouTube</a>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;