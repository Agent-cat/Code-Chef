import React, { useState } from 'react';
import logo from '../assets/telegram.png';
const Home = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleRedirect = () => {
    window.open('https://t.me/klcodechef_bot?startgroup=true', '_blank');
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  return (
    <div className='h-[calc(100vh-5rem)]'>
      {showBanner && (
        <div className="bg-black text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex gap-5 items-center">
             <img src={logo} alt="" className='w-8 h-8' />
              <p className="text-sm sm:text-base">
                Get exam reminders and updates! Add our Telegram bot to your group.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRedirect}
                className="bg-white text-black px-4 py-1 rounded-md text-sm hover:bg-gray-100 transition-colors"
              >
                Add Bot
              </button>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-300"
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;  
