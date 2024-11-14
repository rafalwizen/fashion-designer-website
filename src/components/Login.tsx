import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setIsAdmin: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setIsAdmin }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tutaj dodaj logikę logowania/rejestracji
        console.log('Form submitted:', { username, password, isRegistering });
        // Przykładowa logika:
        if (username === 'admin' && password === 'admin') {
            setIsLoggedIn(true);
            setIsAdmin(true);
        } else {
            setIsLoggedIn(true);
            setIsAdmin(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-dark-navy mb-4">
                {isRegistering ? t('register') : t('login')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-dark-navy mb-1">{t('username')}</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-dark-navy mb-1">{t('password')}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <button type="submit" className="bg-powder-pink text-dark-navy px-4 py-2 rounded w-full">
                    {isRegistering ? t('register') : t('login')}
                </button>
            </form>
            <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="mt-4 text-dark-navy underline"
            >
                {isRegistering ? t('alreadyHaveAccount') : t('dontHaveAccount')}
            </button>
        </div>
    );
};

export default Login;