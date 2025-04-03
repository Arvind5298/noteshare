import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CreditCard, Eye, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Share Your College Notes
          <span className="block text-indigo-600">Help Others Learn</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload your notes, share knowledge, and help fellow students succeed in their academic journey.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Quality Notes</h3>
                <p className="mt-5 text-base text-gray-500">
                  Access high-quality, verified notes from top students across different subjects and courses.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Community Driven</h3>
                <p className="mt-5 text-base text-gray-500">
                  Join a community of students helping each other succeed through knowledge sharing.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Viewing</h3>
                <p className="mt-5 text-base text-gray-500">
                  Our secure viewing system protects content creators while providing access to valuable study materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="mt-24 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 bg-indigo-600 sm:p-10 sm:pb-6">
          <div className="flex items-center justify-center">
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-indigo-600">
              Lifetime Access
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-white">₹99</span>
            <span className="ml-1 text-xl font-medium text-indigo-100">one-time</span>
          </div>
          <p className="mt-5 text-lg text-center text-indigo-100">
            Permanent access to all study materials
          </p>
        </div>
        <div className="px-6 pt-6 pb-8 bg-white sm:p-10 sm:pt-6">
          <ul className="mt-4 space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base text-gray-700">Lifetime access to all uploaded notes</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base text-gray-700">Secure online viewing</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base text-gray-700">Search and filter by subject</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base text-gray-700">Access to future notes</p>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              to="/register"
              className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="mt-24">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          How Our Secure Notes System Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4 mx-auto">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 text-center mb-2">View Online</h3>
            <p className="text-gray-500 text-center">
              Access notes directly in your browser with our secure viewer that prevents unauthorized copying.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4 mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 text-center mb-2">Content Protection</h3>
            <p className="text-gray-500 text-center">
              Our system includes watermarks and anti-screenshot technology to protect intellectual property.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4 mx-auto">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 text-center mb-2">One-Time Payment</h3>
            <p className="text-gray-500 text-center">
              Pay just ₹99 once for lifetime access to all current and future notes in our library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;