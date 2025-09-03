interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  isSubItem?: boolean;
  href?: string;
}

interface SidebarItemProps extends MenuItem {
  index: number;
}

function SidebarItem({ icon, label, active, isSubItem, href = '#', index }: SidebarItemProps) {
  return (
    <li className="relative">
      {/* Timeline styling for sub-items */}
      {isSubItem && (
        <>
          <div className="absolute left-[21px] -top-2 bottom-0 w-0.5 bg-gray-700" />
          <div className="absolute left-[21px] top-1/2 w-4 h-0.5 bg-gray-700" />
          <div className="absolute left-[19px] top-1/2 w-1 h-1 bg-gray-800 rounded-full transform -translate-y-1/2" />
        </>
      )}
      <a
        href={href}
        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium 
                   transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 ${
          isSubItem ? 'ml-6' : ''
        } ${
          active
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700 shadow-sm'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        <span className={active ? 'text-blue-700' : 'text-gray-600'}>
          {icon}
        </span>
        <span>{label}</span>
      </a>
    </li>
  );
}

// Icon components for better organization
const icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  academics: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  honors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  btp: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  feedback: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  people: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  startups: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  mentors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  eirs: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function Sidebar() {
  const menuItems: MenuItem[] = [
    { icon: icons.home, label: 'Home', active: false },
    { icon: icons.academics, label: 'Grant Opt1', active: false },
    { icon: icons.honors, label: 'Grant Opt2', active: false },
    { icon: icons.btp, label: 'Grant Opt3', active: false },
    { icon: icons.feedback, label: 'Grant Opt4', active: false },
    { icon: icons.people, label: 'People', active: true },
    { icon: icons.startups, label: 'Startups', active: false, isSubItem: true },
    { icon: icons.mentors, label: 'Mentors', active: false, isSubItem: true },
    { icon: icons.eirs, label: 'EIRs', active: false, isSubItem: true },
  ];

  const loremItems = ['Lorem 1', 'Lorem 2', 'Lorem 3', 'Lorem 4', 'Lorem 5'];

  return (
    <aside className="w-[280px] min-h-[calc(100vh-98px)] bg-white border-r border-[#DEDEDE] relative flex-shrink-0">
      {/* Main Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} {...item} index={index} />
          ))}
        </ul>
      </nav>

      {/* Lorem Section */}
      <section className="mt-8 p-4">
        <ul className="space-y-1">
          {loremItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium 
                         text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="w-2 h-2 bg-gray-800 rounded-full" />
                <span>{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Settings */}
      <div className="absolute bottom-4 left-4 right-4">
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium 
                   text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {icons.settings}
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}