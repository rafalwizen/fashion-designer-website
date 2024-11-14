import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2">
                <h1 className="text-4xl font-bold text-dark-navy mb-4">{t('welcome')}</h1>
                <p className="text-lg text-dark-navy mb-4">
                    {t('homeDescription')}
                </p>
            </div>
            <div className="md:w-1/2">
                <img src="/path-to-your-image.jpg" alt="Designer" className="rounded-full w-64 h-64 object-cover mx-auto" />
            </div>
        </div>
    );
};

export default Home;