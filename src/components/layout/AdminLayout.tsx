import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="h-screen overflow-hidden" style={{ backgroundColor: '#F8F6FF' }}>
      {/* Header */}
      <Header />
      
      <div className="flex h-[calc(100vh-98px)]">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
