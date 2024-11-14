import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-dark-navy mb-4">{t('aboutMe')}</h2>
            <p className="text-lg text-dark-navy mb-4">
                {t('aboutDescription')}
            </p>
            <p className="text-lg text-dark-navy">
                {t('designApproach')}
            </p>
        </div>
    );
};

export default About;