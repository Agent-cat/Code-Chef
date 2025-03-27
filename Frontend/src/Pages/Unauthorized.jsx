import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
        <svg 
          className="mx-auto h-16 w-16 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Link 
            to="/" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 