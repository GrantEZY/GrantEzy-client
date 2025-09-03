export default function Sidebar() {
  const menuItems = [
    { icon: '🏠', label: 'Home', active: false },
    { icon: '🎓', label: 'Academics', active: false },
    { icon: '🏆', label: 'Honors', active: false },
    { icon: '📊', label: 'BTP', active: false },
    { icon: '📝', label: 'Feedback Form', active: false },
    { icon: '👥', label: 'People', active: true },
    { icon: '👨‍🎓', label: 'Student', active: false },
    { icon: '👨‍🏫', label: 'Staff', active: false },
    { icon: '👨‍💼', label: 'Faculty', active: false },
  ];

  const loremItems = [
    'Lorem 1',
    'Lorem 2', 
    'Lorem 3',
    'Lorem 4',
    'Lorem 5',
  ];

  return (
    <aside className="w-64 bg-[#fefeff] border-r border-gray-200 min-h-screen">
      {/* Main Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Lorem Section */}
      <div className="mt-8 p-4">
        <ul className="space-y-2">
          {loremItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Settings at bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">⚙️</span>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}
