export default function RoleSelectionMenu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full">
      {/* Title */}
      <h1 
        className="text-gray-800 mb-8"
        style={{ 
          fontFamily: 'Inter', 
          fontWeight: 300, 
          fontSize: '36px', 
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        Role Selection Menu
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-gray-600 mb-12"
        style={{ 
          fontFamily: 'Inter', 
          fontWeight: 300, 
          fontSize: '28px', 
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        Choose Role to Manage:
      </p>
      
      {/* Role Cards */}
      <div className="flex justify-center items-center space-x-12">
        {/* Student Card */}
        <div 
          className="bg-white border border-gray-200 text-center hover:shadow-lg transition-shadow cursor-pointer"
          style={{
            width: '400px',
            height: '250px',
            borderRadius: '30px',
            boxShadow: '0px 0px 13.9px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 
            className="text-gray-800"
            style={{ 
              fontFamily: 'Inter', 
              fontWeight: 400, 
              fontSize: '26px', 
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center'
            }}
          >
            Student
          </h3>
        </div>
        
        {/* Faculty Card */}
        <div 
          className="bg-white border border-gray-200 text-center hover:shadow-lg transition-shadow cursor-pointer"
          style={{
            width: '400px',
            height: '250px',
            borderRadius: '30px',
            boxShadow: '0px 0px 13.9px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 
            className="text-gray-800"
            style={{ 
              fontFamily: 'Inter', 
              fontWeight: 400, 
              fontSize: '26px', 
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center'
            }}
          >
            Faculty
          </h3>
        </div>
      </div>
    </div>
  );
}
