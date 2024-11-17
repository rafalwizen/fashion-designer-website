import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UserDetails {
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
}

const UserPanel: React.FC = () => {
    const { t } = useTranslation();
    const [userDetails, setUserDetails] = useState<UserDetails>({
        first_name: '',
        last_name: '',
        address: '',
        phone: '',
    });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/user-details', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/user-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userDetails),
            });
            if (response.ok) {
                alert(t('detailsUpdated'));
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-dark-navy mb-4">{t('userPanel')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="first_name" className="block text-dark-navy mb-1">{t('firstName')}</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={userDetails.first_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-dark-navy mb-1">{t('lastName')}</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={userDetails.last_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-dark-navy mb-1">{t('address')}</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={userDetails.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-dark-navy mb-1">{t('phone')}</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-dark-navy rounded"
                    />
                </div>
                <button type="submit" className="bg-powder-pink text-dark-navy px-4 py-2 rounded w-full">
                    {t('saveChanges')}
                </button>
            </form>
        </div>
    );
};

export default UserPanel;