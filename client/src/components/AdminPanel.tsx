import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        fetchUserCount();
    }, []);

    // Fetch the number of registered users
    const fetchUserCount = async () => {
        try {
            const response = await fetch('http://localhost:5000/user-count', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching user count:', error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-dark-navy mb-4">{t('adminPanel')}</h2>
            <p className="text-lg text-dark-navy">
                {t('registeredUsers')}: <span className="font-bold">{userCount}</span>
            </p>
        </div>
    );
};

export default AdminPanel;