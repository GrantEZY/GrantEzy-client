export default function RoleSelectionMenu() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Role Selection Menu</h1>
      
      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-12 text-center">Choose Role to Manage:</p>
      
      {/* Role Cards */}
      <div className="flex justify-center items-center space-x-12">
        {/* Student Card */}
        <div className="bg-[#fefeff] rounded-lg border border-gray-200 p-8 w-64 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-800">Student</h3>
        </div>
        
        {/* Faculty Card */}
        <div className="bg-[#fefeff] rounded-lg border border-gray-200 p-8 w-64 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-800">Faculty</h3>
        </div>
      </div>
    </div>
  );
}
