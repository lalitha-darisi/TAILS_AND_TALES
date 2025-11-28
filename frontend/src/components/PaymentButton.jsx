import React, { useState } from 'react';
import api from '../api/api';
import { CreditCard, Loader2, Sparkles } from 'lucide-react';

export default function PaymentButton({ bookingId, className }) {
  const [loading, setLoading] = useState(false);

 const go = async () => {
  try {
    setLoading(true);

    // ⭐ STORE booking ID BEFORE redirecting to Stripe
    localStorage.setItem("paidBookingId", bookingId);

    const res = await api.post('/payments/create-checkout', {
      bookingId,
      successUrl: window.location.origin + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: window.location.origin + '/payment-cancel'
    });

    // redirect to Stripe Checkout
    window.location.href = res.data.url;

  } catch (err) {
    alert(err.response?.data?.message || err.message);
    setLoading(false);
  }
};


  return (
    <button 
      onClick={go} 
      disabled={loading}
      className={className || 'inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none'}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Redirecting to Checkout...</span>
        </>
      ) : (
        <>
          <CreditCard size={20} />
          <span>Pay Now</span>
          <Sparkles size={18} className="animate-pulse" />
        </>
      )}
    </button>
  );
}