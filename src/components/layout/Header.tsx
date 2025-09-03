import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#fefeff] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and College Name */}
        <div className="flex items-center space-x-4">
          <Image
            src="/assets/College_Logo.png"
            alt="College Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800">
              Indian Institute of Information Technology Sri City
            </h1>
            <p className="text-sm text-gray-600">भारतीय सूचना प्रौद्योगिकी संस्थान श्री सिटी</p>
          </div>
        </div>

        {/* Right side - Search and User Info */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Hello, Sai Tej</span>
            <span className="text-xs text-gray-500">Have a great day!</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">ST</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
