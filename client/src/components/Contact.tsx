import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tutaj dodaj logikę wysyłania formularza
        console.log('Form submitted:', { name, email, message });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-dark-navy mb-4">{t('contact')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-dark-navy mb-1">{t('name')}</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-dark-navy mb-1">{t('email')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-dark-navy mb-1">{t('message')}</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full p-2 border border-dark-navy rounded h-32"
                    ></textarea>
                </div>
                <button type="submit" className="bg-powder-pink text-dark-navy px-4 py-2 rounded">
                    {t('send')}
                </button>
            </form>
        </div>
    );
};

export default Contact;