export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

if (!PAYPAL_CLIENT_ID) {
    console.warn('PayPal Client ID is not set. Please check your environment variables.');
}