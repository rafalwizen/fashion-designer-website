import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentModalProps {
    onClose: () => void;
    totalAmount: number | string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, totalAmount }) => {
    const { t } = useTranslation();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here I will integrate with a payment gateway
        console.log('Processing payment:', { cardNumber, expiryDate, cvv, totalAmount });
        // After successful payment:
        alert(t('paymentSuccessful'));
        onClose();
    };

    const formatAmount = (amount: number | string): string => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{t('payment')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            {t('cardNumber')}
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                            pattern="\d{16}"
                            maxLength={16}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            {t('expiryDate')}
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                            pattern="\d{2}/\d{2}"
                            placeholder="MM/YY"
                            maxLength={5}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                            {t('cvv')}
                        </label>
                        <input
                            type="text"
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                            pattern="\d{3,4}"
                            maxLength={4}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="font-bold">{t('totalAmount')}: ${formatAmount(totalAmount)}</p>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('pay')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;