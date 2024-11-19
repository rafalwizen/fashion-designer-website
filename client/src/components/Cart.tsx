import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

interface CartProps {
    isLoggedIn: boolean;
}

interface CartItem {
    id: number;
    name: string;
    price: number | string;
}

const Cart: React.FC<CartProps> = ({ isLoggedIn }) => {
    const { t } = useTranslation();
    const { items, removeFromCart } = useCart();

    const totalPrice = items.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0), 0);

    const handleRemove = (id: number) => {
        removeFromCart(id);
    };

    const formatPrice = (price: number | string): string => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price);
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('cart')}</h2>
            {items.length === 0 ? (
                <p>{t('cartEmpty')}</p>
            ) : (
                <>
                    {items.map((item: CartItem) => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <div>
                                <span className="mr-4">${formatPrice(item.price)}</span>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                    aria-label={t('removeFromCart', { name: item.name })}
                                >
                                    {t('remove')}
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold">{t('total')}</span>
                            <span className="font-bold">${formatPrice(totalPrice)}</span>
                        </div>
                        {!isLoggedIn && (
                            <Link
                                to="/login"
                                className="block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                {t('loginToCheckout')}
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;