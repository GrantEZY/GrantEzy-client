export default function RoleSelectionMenu() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8">
      {/* Title */}
      <h1 
        className="text-gray-800 mb-6"
        style={{ 
          fontFamily: 'Inter', 
          fontWeight: 300, 
          fontSize: '32px', 
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        Role Selection Menu
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-gray-600 mb-8"
        style={{ 
          fontFamily: 'Inter', 
          fontWeight: 300, 
          fontSize: '24px', 
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        Choose Role to Manage:
      </p>
      
      {/* Role Cards */}
      <div className="flex justify-center items-center space-x-8">
        {/* Startups Card */}
        <div 
          className="bg-white border border-gray-200 text-center hover:shadow-lg transition-shadow cursor-pointer"
          style={{
            width: '300px',
            height: '200px',
            borderRadius: '30px',
            boxShadow: '0px 0px 13.9px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 
            className="text-gray-800"
            style={{ 
              fontFamily: 'Inter', 
              fontWeight: 400, 
              fontSize: '22px', 
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center'
            }}
          >
            Startups
          </h3>
        </div>
        
        {/* EIRs Card */}
        <div 
          className="bg-white border border-gray-200 text-center hover:shadow-lg transition-shadow cursor-pointer"
          style={{
            width: '300px',
            height: '200px',
            borderRadius: '30px',
            boxShadow: '0px 0px 13.9px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h3 
            className="text-gray-800"
            style={{ 
              fontFamily: 'Inter', 
              fontWeight: 400, 
              fontSize: '22px', 
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center'
            }}
          >
            EIRs
          </h3>
        </div>
      </div>
    </div>
  );
}
