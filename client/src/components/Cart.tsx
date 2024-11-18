import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
    const { t } = useTranslation();
    const { items, removeFromCart, clearCart } = useCart();

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-dark-navy mb-4">{t('cart')}</h2>
            {items.length === 0 ? (
                <p>{t('cartEmpty')}</p>
            ) : (
                <>
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                            <span>{item.name}</span>
                            <div>
                                <span className="mr-2">${item.price}</span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    {t('remove')}
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <p className="font-bold">{t('total')}: ${total}</p>
                        <button
                            onClick={clearCart}
                            className="mt-2 bg-powder-pink text-dark-navy px-4 py-2 rounded hover:bg-powder-pink-dark"
                        >
                            {t('clearCart')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;