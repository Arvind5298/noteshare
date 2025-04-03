import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface PaymentButtonProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      onError('Please log in to continue');
      return;
    }

    setLoading(true);
    
    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      
      if (!res) {
        onError('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create order on server (in a real app, this would be a server call)
      // For demo purposes, we'll simulate the order creation
      const orderData = {
        amount: 9900, // amount in paise (₹99)
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan: 'Lifetime Access'
        }
      };

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'StudyNotes',
        description: 'Lifetime Access to StudyNotes',
        order_id: orderData.receipt, // In a real app, this would be the actual order ID from Razorpay
        handler: async function (response: any) {
          // Payment successful
          try {
            // Create subscription record with permanent access
            const { error } = await supabase
              .from('subscriptions')
              .insert({
                user_id: user.id,
                plan: 'Lifetime Access',
                active: true,
                // Set a far future date for permanent access
                expires_at: new Date('2099-12-31').toISOString(),
                payment_id: response.razorpay_payment_id
              });

            if (error) throw error;
            
            onSuccess();
          } catch (err: any) {
            onError(err.message);
          }
        },
        prefill: {
          email: user.email
        },
        theme: {
          color: '#4f46e5' // Indigo color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      onError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
    >
      {loading ? 'Processing...' : 'Pay ₹99'}
    </button>
  );
};

export default PaymentButton;