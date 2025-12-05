import { ReactNode } from 'react';

import Header from './Header';
import PMSidebar from './PMSidebar.tsx';

interface PMLayoutProps {
  children: ReactNode;
}

export default function PMLayout({ children }: PMLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background-light)]">
      <Header />

      <div className="flex h-[calc(100vh-98px)]">
        <PMSidebar />

        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
