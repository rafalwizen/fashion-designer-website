import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';

import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Login from './components/Login';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import PaymentModal from './components/PaymentModal';
import { CartProvider, useCart } from './contexts/CartContext';

const CartModal: React.FC<{ onClose: () => void, isLoggedIn: boolean }> = ({ onClose, isLoggedIn }) => {
    const { t } = useTranslation();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { items, clearCart } = useCart();
    const totalPrice = items.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0), 0);

    const handleCheckout = () => {
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('cart')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <Cart isLoggedIn={isLoggedIn} />
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        {t('clearCart')}
                    </button>
                    {isLoggedIn && (
                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            {t('proceedToCheckout')}
                        </button>
                    )}
                </div>
            </div>
            {isPaymentModalOpen && (
                <PaymentModal
                    onClose={() => setIsPaymentModalOpen(false)}
                    totalAmount={totalPrice}
                />
            )}
        </div>
    );
};

const AppContent: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { items } = useCart();

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
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative hover:text-powder-pink"
                                aria-label={t('openCart')}
                            >
                                <ShoppingCart size={24} />
                                {items.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-powder-pink text-dark-navy rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {items.length}
                                    </span>
                                )}
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

                {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} isLoggedIn={isLoggedIn} />}
            </div>
        </Router>
    );
};

const App: React.FC = () => (
    <CartProvider>
        <AppContent />
    </CartProvider>
);

export default App;