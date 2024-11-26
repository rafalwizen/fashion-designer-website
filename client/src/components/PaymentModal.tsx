import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from '../config';

interface PaymentModalProps {
    onClose: () => void;
    totalAmount: number | string;
}

export default function PaymentModal({ onClose, totalAmount }: PaymentModalProps) {
    const { t } = useTranslation();
    const [paypalError, setPaypalError] = useState<string | null>(null);

    useEffect(() => {
        if (!PAYPAL_CLIENT_ID) {
            setPaypalError('PayPal Client ID is not configured');
        }
    }, []);

    const handlePaymentSuccess = (details: Record<string, unknown>) => {
        console.log('Payment completed successfully', details);
        alert(t('paymentSuccessful'));
        onClose();
    };

    const handlePaymentError = (error: unknown) => {
        console.error('Payment error:', error);
        alert(t('paymentFailed'));
    };

    const formatAmount = (amount: number | string): string => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
    };

    const numericTotalAmount = parseFloat(formatAmount(totalAmount));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('payment')}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>
                <p className="mb-4 font-bold">{t('totalAmount')}: ${formatAmount(totalAmount)}</p>

                {paypalError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{t('paypalConfigError')}</p>
                        <p className="text-sm">{paypalError}</p>
                    </div>
                ) : (
                    <PayPalScriptProvider options={{
                        clientId: PAYPAL_CLIENT_ID,
                        currency: "USD",
                        intent: "capture"
                    }}>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(_, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: numericTotalAmount.toString(),
                                                currency_code: 'USD'
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(_, actions) => {
                                return actions.order!.capture().then((details) => {
                                    handlePaymentSuccess(details as Record<string, unknown>);
                                    return Promise.resolve();
                                });
                            }}
                            onError={(error) => {
                                handlePaymentError(error);
                                return Promise.resolve();
                            }}
                        />
                    </PayPalScriptProvider>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {t('cancel')}
                </button>
            </div>
        </div>
    );
}