import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setIsAdmin: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setIsAdmin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const url = isRegistering ? 'http://localhost:5000/register' : 'http://localhost:5000/login';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (!isRegistering) {
                    localStorage.setItem('token', data.token);
                    setIsLoggedIn(true);
                    setIsAdmin(data.isAdmin);

                    // Redirect based on admin status
                    if (data.isAdmin) {
                        navigate('/admin-panel');
                    } else {
                        navigate('/user-panel');
                    }
                } else {
                    setIsRegistering(false);
                }
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-dark-navy mb-4">
                {isRegistering ? t('register') : t('login')}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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