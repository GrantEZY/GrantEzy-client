import { ReactNode } from "react";

import Header from "./Header";
import ReviewerSidebar from "@/components/layout/ReviewerSidebar";

interface ReviewerLayoutProps {
  children: ReactNode;
}

export default function ReviewerLayout({ children }: ReviewerLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background-light)]">
      <Header />

      <div className="flex h-[calc(100vh-98px)]">
        <ReviewerSidebar />

        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
