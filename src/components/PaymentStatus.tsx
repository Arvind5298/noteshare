import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatusProps {
  status: 'success' | 'failure';
  message?: string;
  paymentId?: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  message = status === 'success' 
    ? 'Your payment was successful!' 
    : 'There was an issue with your payment.',
  paymentId
}) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {status === 'success' ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
          
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
          
          {paymentId && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Payment ID: {paymentId}
            </p>
          )}
          
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;