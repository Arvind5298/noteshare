import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { FileText, Upload, Download, CreditCard, BookOpen, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('Free Plan');
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSubscriptionStatus('Lifetime Access');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setSubscriptionStatus('Lifetime Access');
    // Show success message
    alert('Payment successful! You now have lifetime access to all notes.');
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Semester and Branch Selection */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-indigo-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
            Select Your Academic Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Choose your semester and branch to find relevant notes
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <div className="flex flex-wrap gap-2">
                {semesters.map((semester) => (
                  <button
                    key={semester}
                    type="button"
                    onClick={() => setSelectedSemester(semester)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedSemester === semester
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {semester}
                  </button>
                ))}
                {selectedSemester && (
                  <button
                    type="button"
                    onClick={() => setSelectedSemester(null)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <div className="relative">
                <select
                  id="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="CSE">Computer Science Engineering (CSE)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {selectedSemester 
                    ? `Semester ${selectedSemester} - ${selectedBranch}` 
                    : 'Select a semester to view relevant notes'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedSemester 
                    ? 'You can now browse or upload notes for this semester and branch' 
                    : 'Choose from semesters 1-8 to filter notes'}
                </p>
              </div>
            </div>
            
            {selectedSemester && (
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/library')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Notes
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Uploaded Notes
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Download className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Downloads
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Subscription Status
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{subscriptionStatus}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      {subscriptionStatus === 'Free Plan' && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
              Get Lifetime Access
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              One-time payment for permanent access
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {paymentSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                Payment successful! You now have lifetime access to all notes.
              </div>
            )}
            
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Lifetime Access</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Get permanent access to all notes for just ₹99
                </p>
                <p className="mt-2 text-sm text-indigo-600 font-medium">
                  Current status: {subscriptionStatus}
                </p>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                <PaymentButton 
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900">What's included:</h5>
              <ul className="mt-2 divide-y divide-gray-200">
                <li className="py-2 flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime access to all uploaded notes
                </li>
                <li className="py-2 flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure online viewing
                </li>
                <li className="py-2 flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to future notes
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {subscriptionStatus !== 'Free Plan' && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-green-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-green-600" />
              Lifetime Access Active
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              You have permanent access to all notes
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="mt-2 text-lg font-medium text-gray-900">Thank you for your purchase!</h4>
                <p className="mt-1 text-sm text-gray-500">
                  You now have unlimited access to all notes on the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4 text-center text-gray-500">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;