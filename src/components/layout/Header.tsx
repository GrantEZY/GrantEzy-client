import Image from 'next/image';

export default function Header() {
  return (
    <header 
      className="bg-white border-b px-6 py-4 w-full"
      style={{
        height: '98px',
        borderColor: '#C8C8C8',
        borderWidth: '1px'
      }}
    >
      <div className="flex items-center justify-between h-full max-w-full">
        {/* Left side - Logo and College Name */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Image
            src="/assets/College_Logo.png"
            alt="College Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800 leading-tight">
              Indian Institute of Information
            </h1>
            <h1 className="text-lg font-semibold text-gray-800 leading-tight">
              Technology Sri City
            </h1>
            <p className="text-sm text-gray-600">भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी</p>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#F8F6FF] rounded-[30px] px-6 py-4 pr-12 focus:outline-none border-0"
              style={{ 
                width: '400px', 
                maxWidth: '400px',
                height: '55px',
                fontFamily: 'Inter', 
                fontSize: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.25)'
              }}
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right side - Notification and User Info */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div 
                className="text-gray-800"
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: 600, 
                  fontSize: '16px', 
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                Hello, Sai Tej
              </div>
              <div 
                className="text-gray-500"
                style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                Have a great day!
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">ST</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
